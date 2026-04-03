import React from "react"
import { GlassCard } from "./GlassCard"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "./button"
import Link from "next/link"

export function AdBanner() {
  return (
    <GlassCard className="my-6 bg-primary/5 border-primary/20 p-0 overflow-hidden" hoverable={false}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 animate-pulse">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary/60">Premium Experience</p>
            <h4 className="text-xl font-bold tracking-tight">Tired of advertisements?</h4>
            <p className="text-muted-foreground mt-1">
              Upgrade to a <span className="font-bold text-foreground">Pro plan</span> to manage unlimited units and remove all sponsored content.
            </p>
          </div>
        </div>
        <Button asChild variant="brand" size="sm" className="shrink-0 group">
          <Link href="/billing">
            Upgrade Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </GlassCard>
  )
}
