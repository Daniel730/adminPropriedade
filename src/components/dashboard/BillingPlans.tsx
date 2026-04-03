"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/GlassCard"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Plan {
  id: string
  name: string
  unitLimit: number
  priceMonthyCents: number
  adsEnabled: boolean
}

interface BillingPlansProps {
  plans: Plan[]
  currentPlanId?: string
  hasSubscription: boolean
}

export function BillingPlans({ plans, currentPlanId, hasSubscription }: BillingPlansProps) {
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleCheckout(planId: string) {
    setLoadingPlanId(planId)
    setError(null)

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Checkout failed.")
        return
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoadingPlanId(null)
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrent = currentPlanId === plan.id
          const isGrowth = plan.name === "Growth"
          const isLoading = loadingPlanId === plan.id
          
          return (
            <GlassCard 
              key={plan.id} 
              className={cn(
                "flex flex-col relative p-0 overflow-hidden border-none transition-all duration-500",
                isCurrent ? "ring-2 ring-primary shadow-2xl shadow-primary/20 scale-[1.02] z-10" : "opacity-90 hover:opacity-100 shadow-xl"
              )}
              hoverable={!isCurrent}
            >
              {isCurrent && (
                <div className="absolute top-4 right-4">
                  <Badge variant="brand" className="shadow-lg py-1 px-3">ACTIVE</Badge>
                </div>
              )}
              
              <div className={cn(
                "p-8 pb-0",
                isGrowth && "bg-primary/5"
              )}>
                <p className={cn(
                  "text-xs font-black uppercase tracking-widest mb-2",
                  isGrowth ? "text-primary" : "text-muted-foreground"
                )}>{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter">${plan.priceMonthyCents / 100}</span>
                  <span className="text-muted-foreground font-bold">/mo</span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between gap-8">
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold">Up to {plan.unitLimit} Units</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold">Unlimited Requests</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className={cn(
                      "h-5 w-5 rounded-full flex items-center justify-center shrink-0",
                      plan.adsEnabled ? "bg-amber-500/20" : "bg-emerald-500/20"
                    )}>
                      {plan.adsEnabled ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" strokeWidth={3} />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} />
                      )}
                    </div>
                    <span className={cn(
                      "text-sm font-bold",
                      plan.adsEnabled ? "text-amber-700/80" : "text-foreground"
                    )}>{plan.adsEnabled ? "Standard Ads" : "No Advertisements"}</span>
                  </li>
                </ul>
                
                {isCurrent ? (
                  <Button className="w-full rounded-2xl h-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed" disabled>
                    Active Plan
                  </Button>
                ) : plan.priceMonthyCents === 0 ? (
                  <Button className="w-full rounded-2xl h-12 border-2 border-dashed border-muted text-muted-foreground hover:bg-muted/10" variant="outline" disabled>
                    Included Tier
                  </Button>
                ) : (
                  <Button 
                    className="w-full rounded-2xl h-12 shadow-lg group transition-all duration-300" 
                    type="button" 
                    variant={isGrowth ? "brand" : "default"}
                    disabled={!!loadingPlanId}
                    onClick={() => handleCheckout(plan.id)}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        {hasSubscription ? "Switch Plan" : "Get Started"}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
