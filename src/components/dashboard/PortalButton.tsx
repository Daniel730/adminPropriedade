"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"

export function PortalButton() {
  const [loading, setLoading] = useState(false)

  async function handlePortal() {
    setLoading(true)
    try {
      const res = await fetch("/api/billing/portal", {
        method: "POST",
      })

      const data = await res.json()

      if (data.portalUrl) {
        window.location.href = data.portalUrl
      }
    } catch {
      console.error("Portal redirect failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      type="button" 
      variant="outline" 
      size="lg" 
      className="rounded-2xl group shadow-sm hover:shadow-md transition-all"
      onClick={handlePortal}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          Customer Portal <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </Button>
  )
}
