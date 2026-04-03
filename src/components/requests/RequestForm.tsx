"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GlassCard } from "@/components/ui/GlassCard"
import { Wrench, FileText, Loader2, CheckCircle2, ArrowRight } from "lucide-react"

interface RequestFormProps {
  unitId?: string
}

interface SuccessData {
  id: string
}

export function RequestForm({ unitId }: RequestFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<SuccessData | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, unitId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.")
        return
      }

      setSuccess({ id: data.id })
      setTitle("")
      setDescription("")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <GlassCard className="border-emerald-500/20 bg-emerald-500/5 p-8 text-center animate-in zoom-in-95 duration-500" hoverable={false}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">Request Received</h3>
            <p className="text-emerald-700/80 dark:text-emerald-400/80 max-w-sm mx-auto">
              Your maintenance request has been logged. Tracking ID: <span className="font-mono font-bold">{success.id.slice(0, 8)}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-xs">
            <Button asChild variant="brand" className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20">
              <Link href="/requests">View All Requests</Link>
            </Button>
            <Button variant="ghost" onClick={() => setSuccess(null)}>
              New Request
            </Button>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="border-none shadow-2xl shadow-primary/5 p-8" hoverable={false}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Wrench className="h-3 w-3" /> Issue Summary
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs attention?"
            required
            disabled={loading}
            className="h-12 rounded-xl bg-background/50 focus-visible:ring-primary border-muted/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <FileText className="h-3 w-3" /> Detailed Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide more details about the problem..."
            rows={5}
            required
            disabled={loading}
            className="rounded-xl bg-background/50 focus-visible:ring-primary border-muted/20 resize-none"
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        <div className="pt-2">
          <Button 
            type="submit" 
            variant="brand" 
            size="lg" 
            className="w-full shadow-primary/20 group" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Request
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
