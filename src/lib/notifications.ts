import { prisma } from "./prisma"
import { resend, FROM_EMAIL } from "./resend"
import { StatusChangeEmail } from "@/emails/StatusChangeEmail"
import { VendorAssignedEmail } from "@/emails/VendorAssignedEmail"
import { BillingEmail } from "@/emails/BillingEmail"
import { RequestStatus, NotificationType } from "./types"

export async function notifyStatusChange(requestId: string, newStatus: RequestStatus) {
  const request = await prisma.maintenanceRequest.findUnique({
    where: { id: requestId },
    include: {
      tenant: true,
      unit: { include: { property: { include: { manager: true } } } },
    },
  })

  if (!request) return

  // 1. Create Notification record for Tenant
  await prisma.notification.create({
    data: {
      userId: request.tenantId,
      requestId: request.id,
      type: NotificationType.STATUS_CHANGE,
      message: `Your request '${request.title}' is now ${newStatus}.`,
    },
  })

  // 2. Send Email to Tenant
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: request.tenant.email,
      subject: `Status Update: ${request.title}`,
      react: StatusChangeEmail({
        tenantName: request.tenant.name,
        requestTitle: request.title,
        newStatus: newStatus,
        requestId: request.id,
      }),
    })
  } catch (error) {
    console.error("Failed to send status change email:", error)
  }

  // 3. If RESOLVED, also notify Manager
  if (newStatus === RequestStatus.RESOLVED) {
    const manager = request.unit.property.manager
    await prisma.notification.create({
      data: {
        userId: manager.id,
        requestId: request.id,
        type: NotificationType.STATUS_CHANGE,
        message: `Request '${request.title}' has been resolved.`,
      },
    })
  }
}

export async function notifyVendorAssigned(requestId: string, vendorId: string) {
  const request = await prisma.maintenanceRequest.findUnique({
    where: { id: requestId },
    include: {
      unit: { include: { property: true } },
      vendor: true,
    },
  })

  const vendor = await prisma.user.findUnique({ where: { id: vendorId } })

  if (!request || !vendor) return

  // 1. Create Notification record for Vendor
  await prisma.notification.create({
    data: {
      userId: vendor.id,
      requestId: request.id,
      type: NotificationType.VENDOR_ASSIGNED,
      message: `New request assigned: '${request.title}' at ${request.unit.property.name}.`,
    },
  })

  // 2. Send Email to Vendor
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: vendor.email,
      subject: `New Maintenance Assignment: ${request.title}`,
      react: VendorAssignedEmail({
        vendorName: vendor.name,
        requestTitle: request.title,
        unitNumber: request.unit.unitNumber,
        propertyName: request.unit.property.name,
        requestId: request.id,
      }),
    })
  } catch (error) {
    console.error("Failed to send vendor assignment email:", error)
  }
}

export async function notifyReopen(requestId: string) {
  const request = await prisma.maintenanceRequest.findUnique({
    where: { id: requestId },
    include: {
      unit: { include: { property: { include: { manager: true } } } },
    },
  })

  if (!request) return

  const manager = request.unit.property.manager

  // Create Notification record for Manager
  await prisma.notification.create({
    data: {
      userId: manager.id,
      requestId: request.id,
      type: NotificationType.STATUS_CHANGE,
      message: `Request '${request.title}' has been re-opened by the manager.`,
    },
  })
}

export async function notifyBilling(
  managerId: string,
  eventType: "failed" | "resolved",
  gracePeriodEnd?: Date
) {
  const manager = await prisma.user.findUnique({ where: { id: managerId } })
  if (!manager) return

  // 1. Create Notification record
  await prisma.notification.create({
    data: {
      userId: manager.id,
      type: NotificationType.BILLING,
      message: eventType === "failed" 
        ? "Your subscription payment failed. Account is in grace period."
        : "Your subscription payment was successful.",
    },
  })

  // 2. Send Email
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: manager.email,
      subject: eventType === "failed" ? "Action Required: Payment Failed" : "Subscription Payment Successful",
      react: BillingEmail({
        managerName: manager.name,
        eventType,
        gracePeriodEnd: gracePeriodEnd?.toLocaleDateString(),
      }),
    })
  } catch (error) {
    console.error("Failed to send billing email:", error)
  }
}
