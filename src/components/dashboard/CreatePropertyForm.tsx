"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/GlassCard"
import { Building2, MapPin, Loader2, PlusCircle } from "lucide-react"

export function CreatePropertyForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to create property.")
        return
      }

      router.push("/properties")
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard className="max-w-xl mx-auto border-none shadow-2xl shadow-primary/5 p-8" hoverable={false}>
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Add Property</h3>
          <p className="text-sm text-muted-foreground">Register a new asset to your portfolio.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Building2 className="h-3 w-3" /> Property Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Royal Heights Apartments"
            required
            disabled={loading}
            className="h-12 rounded-xl bg-background/50 focus-visible:ring-primary border-muted/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <MapPin className="h-3 w-3" /> Physical Address
          </Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Luxury Lane, Metropolis"
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

        <div className="pt-4">
          <Button 
            type="submit" 
            variant="brand" 
            size="lg" 
            className="w-full shadow-primary/20" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Property...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-5 w-5" />
                Register Property
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
            Cancel and Return
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
