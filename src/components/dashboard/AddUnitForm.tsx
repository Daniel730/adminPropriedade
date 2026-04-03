"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Loader2, Home } from "lucide-react"

interface AddUnitFormProps {
  propertyId: string
}

export function AddUnitForm({ propertyId }: AddUnitFormProps) {
  const router = useRouter()
  const [unitNumber, setUnitNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/properties/${propertyId}/units`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitNumber }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to add unit.")
        return
      }

      setUnitNumber("")
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex items-end gap-3 group/form">
        <div className="space-y-1.5 flex-1 max-w-[140px]">
          <Label htmlFor="unitNumber" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Home className="h-3 w-3" /> Unit No.
          </Label>
          <Input
            id="unitNumber"
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
            placeholder="e.g. 101"
            className="h-10 rounded-xl bg-background/50 border-muted/20 focus-visible:ring-primary"
            required
            disabled={loading}
          />
        </div>
        <Button 
          type="submit" 
          variant="brand" 
          size="sm" 
          disabled={loading} 
          className="h-10 px-4 rounded-xl shadow-primary/10"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4 group-hover/form:scale-110 transition-transform" />
              Add Unit
            </>
          )}
        </Button>
      </form>
      {error && (
        <p className="text-[10px] font-bold text-destructive uppercase tracking-tight animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  )
}
