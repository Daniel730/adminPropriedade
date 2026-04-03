import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getManagerSubscription } from "@/lib/subscription"
import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, CreditCard, Building2, Zap } from "lucide-react"
import { SubscriptionStatus } from "@/lib/types"
import { BillingPlans } from "@/components/dashboard/BillingPlans"
import { PortalButton } from "@/components/dashboard/PortalButton"

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
    <div className="max-w-6xl mx-auto space-y-12 animate-page-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Billing & Plans
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your subscription and scale your property portfolio.
          </p>
        </div>
        {currentPlan && (
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/5 border border-primary/20 shadow-xl shadow-primary/5">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary/60 leading-none">Current Plan</p>
              <p className="text-lg font-bold text-primary leading-tight">{currentPlan.name}</p>
            </div>
          </div>
        )}
      </div>

      {success && (
        <GlassCard className="bg-emerald-500/10 border-emerald-500/20 text-emerald-700 flex items-center gap-4 py-4" hoverable={false}>
          <CheckCircle2 className="h-6 w-6 shrink-0" />
          <p className="font-bold">Subscription updated successfully! Your new limits are now active.</p>
        </GlassCard>
      )}

      {canceled && (
        <GlassCard className="bg-amber-500/10 border-amber-500/20 text-amber-700 flex items-center gap-4 py-4" hoverable={false}>
          <AlertTriangle className="h-6 w-6 shrink-0" />
          <p className="font-bold">Checkout canceled. No changes were made to your account.</p>
        </GlassCard>
      )}

      {subscription && (
        <GlassCard className="border-none shadow-2xl shadow-primary/5 p-8" hoverable={false}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">Unit Capacity</p>
                </div>
                <p className="text-3xl font-black text-foreground">{subscription.unitLimit} <span className="text-sm font-medium text-muted-foreground">Units</span></p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Zap className="h-4 w-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">Experience</p>
                </div>
                <div className="text-xl font-bold">
                  {subscription.adsEnabled ? (
                    <span className="text-amber-600 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full w-fit">
                      <AlertTriangle className="h-4 w-4" /> Sponsored
                    </span>
                  ) : (
                    <span className="text-emerald-600 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                      <Sparkles className="h-4 w-4" /> Ad-Free
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <p className="text-xs font-bold uppercase tracking-widest">Status</p>
                </div>
                <Badge 
                  variant={subscription.status === SubscriptionStatus.ACTIVE ? "brand" : "destructive"}
                  className="px-4 py-1.5 text-[10px] uppercase font-black tracking-widest shadow-md"
                >
                  {subscription.status}
                </Badge>
              </div>
            </div>

            {currentPlan?.stripePriceId && (
              <div className="pt-8 md:pt-0 md:pl-8 md:border-l border-muted/30">
                <PortalButton />
              </div>
            )}
          </div>

          {subscription.status === SubscriptionStatus.GRACE && subscription.gracePeriodEnd && (
            <div className="mt-8 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive animate-pulse">
              <ShieldAlert className="h-5 w-5" />
              <p className="text-sm font-bold">
                Grace period ending on {new Date(subscription.gracePeriodEnd).toLocaleDateString(undefined, { dateStyle: 'long' })}. Update billing to avoid restriction.
              </p>
            </div>
          )}
        </GlassCard>
      )}

      <div className="space-y-8 pt-6">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">Available Plans</h2>
          <p className="text-muted-foreground text-lg">Scale your management operations with our specialized tiers.</p>
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
