import { SubscriptionStatus } from "./types"
import { prisma } from "./prisma"

export async function getManagerSubscription(managerId: string): Promise<{
  status: SubscriptionStatus
  unitLimit: number
  gracePeriodEnd: Date | null
  adsEnabled: boolean
  planId: string
} | null> {
  let subscription = await prisma.subscription.findUnique({
    where: { managerId },
    include: { plan: true },
  })

  if (!subscription) {
    // Return Free tier defaults if no subscription exists
    const freePlan = await prisma.subscriptionPlan.findUnique({
      where: { name: "Free" },
    })
    return {
      status: SubscriptionStatus.ACTIVE,
      unitLimit: freePlan?.unitLimit ?? 2,
      gracePeriodEnd: null,
      adsEnabled: freePlan?.adsEnabled ?? true,
      planId: freePlan?.id ?? "",
    }
  }

  // Auto-expire grace period to RESTRICTED
  if (
    subscription.status === SubscriptionStatus.GRACE &&
    subscription.gracePeriodEnd &&
    subscription.gracePeriodEnd < new Date()
  ) {
    subscription = await prisma.subscription.update({
      where: { managerId },
      data: { status: SubscriptionStatus.RESTRICTED },
      include: { plan: true },
    })
  }

  return {
    status: subscription.status as SubscriptionStatus,
    unitLimit: subscription.unitLimit,
    gracePeriodEnd: subscription.gracePeriodEnd,
    adsEnabled: subscription.plan.adsEnabled,
    planId: subscription.planId,
  }
}

export async function isAccountRestricted(managerId: string): Promise<boolean> {
  const subscription = await getManagerSubscription(managerId)

  if (!subscription) {
    return true
  }

  return subscription.status === SubscriptionStatus.RESTRICTED
}

export async function getTotalUnitCount(managerId: string): Promise<number> {
  const result = await prisma.unit.count({
    where: {
      property: {
        managerId,
      },
    },
  })

  return result
}
