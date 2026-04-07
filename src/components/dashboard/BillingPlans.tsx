"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
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

  // Find the most popular/recommended plan (Growth tier)
  const popularPlanIndex = plans.findIndex(p => p.name === "Growth")

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan, index) => {
          const isCurrent = currentPlanId === plan.id
          const isPopular = index === popularPlanIndex
          const isLoading = loadingPlanId === plan.id
          
          return (
            <div 
              key={plan.id} 
              className={cn(
                "relative bg-card border rounded-xl p-5 flex flex-col",
                isCurrent && "border-primary ring-1 ring-primary",
                isPopular && !isCurrent && "border-primary/50"
              )}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Popular
                </div>
              )}
              
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Current
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="font-semibold">{plan.name}</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-semibold">${plan.priceMonthyCents / 100}</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  Up to {plan.unitLimit} units
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  Unlimited requests
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className={cn(
                    "h-4 w-4 shrink-0",
                    plan.adsEnabled ? "text-muted-foreground" : "text-primary"
                  )} />
                  <span className={plan.adsEnabled ? "text-muted-foreground" : ""}>
                    {plan.adsEnabled ? "With ads" : "Ad-free experience"}
                  </span>
                </li>
              </ul>
              
              {isCurrent ? (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : plan.priceMonthyCents === 0 ? (
                <Button variant="outline" className="w-full" disabled>
                  Free Tier
                </Button>
              ) : (
                <Button 
                  variant={isPopular ? "default" : "outline"}
                  className="w-full"
                  disabled={!!loadingPlanId}
                  onClick={() => handleCheckout(plan.id)}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    hasSubscription ? "Switch Plan" : "Get Started"
                  )}
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
