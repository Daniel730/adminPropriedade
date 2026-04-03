"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/GlassCard"
import { UserPlus, Mail, Lock, Loader2, ArrowRight } from "lucide-react"

export function InviteVendorForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to invite vendor.")
        return
      }

      router.push("/vendors")
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard className="border-none shadow-2xl shadow-primary/5 p-8" hoverable={false}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <UserPlus className="h-3 w-3" /> Professional Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Acme Plumbing Co."
            required
            disabled={loading}
            className="h-12 rounded-xl bg-background/50 focus-visible:ring-primary border-muted/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Mail className="h-3 w-3" /> Contact Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vendor@example.com"
            required
            disabled={loading}
            className="h-12 rounded-xl bg-background/50 focus-visible:ring-primary border-muted/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Lock className="h-3 w-3" /> Temp Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Set a temporary password"
            required
            disabled={loading}
            className="h-12 rounded-xl bg-background/50 focus-visible:ring-primary border-muted/20"
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
                Processing...
              </>
            ) : (
              <>
                Confirm Invitation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="w-full mt-4 text-muted-foreground hover:text-foreground"
            onClick={() => router.back()}
            disabled={loading}
          >
            Return to Directory
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
