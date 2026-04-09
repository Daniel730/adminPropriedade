import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { validateTransition } from "@/lib/request-transitions"
import { isAccountRestricted } from "@/lib/subscription"
import { RequestStatus } from "@/lib/types"
import {
  notifyStatusChange,
  notifyVendorAssigned,
  notifyReopen,
} from "@/lib/notifications"

const fullInclude = {
  unit: { include: { property: true } },
  tenant: { select: { id: true, name: true, email: true } },
  vendor: { select: { id: true, name: true, email: true } },
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const request = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: fullInclude,
  })

  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const role = session.user.role

  if (role === "TENANT") {
    if (request.tenantId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  } else if (role === "MANAGER") {
    if (request.unit.property.managerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  } else if (role === "VENDOR") {
    if (request.vendorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json(request)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const request = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: { unit: { include: { property: true } } },
  })

  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const role = session.user.role

  if (role === "MANAGER") {
    if (request.unit.property.managerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    const restricted = await isAccountRestricted(session.user.id)
    if (restricted) {
      return NextResponse.json(
        { error: "Your account is restricted." },
        { status: 403 }
      )
    }
  } else if (role === "VENDOR") {
    if (request.vendorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { status: newStatus, vendorId, finalCostCents, vendorRating } = body

  const updateData: { 
    status?: RequestStatus; 
    vendorId?: string | null;
    finalCostCents?: number | null;
    vendorRating?: number | null;
  } = {}

  if (newStatus !== undefined) {
    const validStatuses = Object.values(RequestStatus)
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: "Invalid status value." }, { status: 422 })
    }
    const valid = validateTransition(request.status as RequestStatus, newStatus as RequestStatus)
    if (!valid) {
      return NextResponse.json(
        {
          error: `Cannot transition from ${request.status} to ${newStatus}.`,
        },
        { status: 422 }
      )
    }
    updateData.status = newStatus as RequestStatus
  }

  if (vendorId !== undefined) {
    if (role !== "MANAGER") {
      return NextResponse.json(
        { error: "Only managers can assign vendors." },
        { status: 403 }
      )
    }
    if (vendorId === null) {
      updateData.vendorId = null
    } else {
      const vendor = await prisma.user.findUnique({ where: { id: vendorId } })
      if (!vendor || vendor.role !== "VENDOR" || vendor.vendorManagerId !== session.user.id) {
        return NextResponse.json(
          { error: "Vendor not found or does not belong to your account." },
          { status: 422 }
        )
      }
      updateData.vendorId = vendorId
    }
  }

  if (finalCostCents !== undefined && role === "MANAGER") {
    updateData.finalCostCents = finalCostCents
  }

  if (vendorRating !== undefined && role === "MANAGER") {
    updateData.vendorRating = vendorRating
  }

  const updated = await prisma.maintenanceRequest.update({
    where: { id },
    data: updateData,
    include: fullInclude,
  })

  // Notifications (fire and forget)
  if (newStatus && newStatus !== request.status) {
    if (newStatus === RequestStatus.OPEN) {
      notifyReopen(updated.id)
    } else {
      notifyStatusChange(updated.id, newStatus as RequestStatus)
    }
  }

  if (vendorId && vendorId !== request.vendorId) {
    notifyVendorAssigned(updated.id, vendorId)
  }

  return NextResponse.json(updated)
}
