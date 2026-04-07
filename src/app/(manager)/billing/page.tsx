import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getManagerSubscription } from "@/lib/subscription"
import { CheckCircle2, AlertTriangle, AlertCircle, CreditCard, Building2, Sparkles } from "lucide-react"
import { SubscriptionStatus } from "@/lib/types"
import { BillingPlans } from "@/components/dashboard/BillingPlans"
import { PortalButton } from "@/components/dashboard/PortalButton"
import { cn } from "@/lib/utils"

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>
}) {
  const session = await auth()
  if (!session || session.user.role !== "MANAGER") redirect("/login")

  const { success, canceled } = await searchParams

  const [plans, subscription] = await Promise.all([
    prisma.subscriptionPlan.findMany({ orderBy: { priceMonthyCents: "asc" } }),
    getManagerSubscription(session.user.id),
  ])

  const currentPlanId = subscription?.planId
  const currentPlan = plans.find(p => p.id === currentPlanId)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
          <p className="text-muted-foreground mt-1">
            Manage your subscription and billing details
          </p>
        </div>
        {currentPlan && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{currentPlan.name} Plan</span>
          </div>
        )}
      </div>

      {/* Alerts */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/20 text-success">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">Subscription updated successfully. Your new limits are now active.</p>
        </div>
      )}

      {canceled && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-warning/10 border border-warning/20 text-warning">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">Checkout canceled. No changes were made to your account.</p>
        </div>
      )}

      {/* Current Subscription */}
      {subscription && (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="font-semibold">Current Subscription</h2>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Unit Limit</span>
                </div>
                <p className="text-2xl font-semibold">{subscription.unitLimit}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Experience</span>
                </div>
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium",
                  subscription.adsEnabled 
                    ? "bg-warning/10 text-warning" 
                    : "bg-success/10 text-success"
                )}>
                  {subscription.adsEnabled ? "With Ads" : "Ad-Free"}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Status</span>
                </div>
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium",
                  subscription.status === SubscriptionStatus.ACTIVE 
                    ? "bg-success/10 text-success"
                    : subscription.status === SubscriptionStatus.GRACE
                    ? "bg-warning/10 text-warning"
                    : "bg-destructive/10 text-destructive"
                )}>
                  {subscription.status}
                </div>
              </div>
            </div>

            {subscription.status === SubscriptionStatus.GRACE && subscription.gracePeriodEnd && (
              <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Grace period ends on {new Date(subscription.gracePeriodEnd).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                  <p className="text-xs opacity-80 mt-0.5">Update your billing information to avoid service interruption.</p>
                </div>
              </div>
            )}

            {currentPlan?.stripePriceId && (
              <div className="mt-6 pt-6 border-t">
                <PortalButton />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Available Plans</h2>
          <p className="text-sm text-muted-foreground mt-1">Choose the plan that fits your needs</p>
        </div>
        
        <BillingPlans 
          plans={plans.map(p => ({
            id: p.id,
            name: p.name,
            unitLimit: p.unitLimit,
            priceMonthyCents: p.priceMonthyCents,
            adsEnabled: p.adsEnabled
          }))} 
          currentPlanId={currentPlanId}
          hasSubscription={!!(subscription && subscription.planId)}
        />
      </div>
    </div>
  )
}
