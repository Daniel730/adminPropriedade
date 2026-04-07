import React from "react"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "./button"
import Link from "next/link"

export function AdBanner() {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold">Upgrade to Pro</h4>
            <p className="text-sm text-muted-foreground mt-0.5">
              Remove ads and unlock unlimited units
            </p>
          </div>
        </div>
        <Button asChild size="sm" className="shrink-0 w-full md:w-auto">
          <Link href="/billing">
            Upgrade
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
