"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/GlassCard"
import { User, Search, Loader2, X, UserPlus, UserMinus } from "lucide-react"

interface Tenant {
  id: string
  name: string
  email: string
}

interface ManageUnitModalProps {
  unit: {
    id: string
    unitNumber: string
    tenant: { id: string; name: string; email: string } | null
  }
  onClose: () => void
}

export function ManageUnitModal({ unit, onClose }: ManageUnitModalProps) {
  const router = useRouter()
  const [searchEmail, setSearchEmail] = useState("")
  const [searchResults, setSearchResults] = useState<Tenant[]>([])
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setSearchEmail("")
    setSearchResults([])
    setError(null)
    setSuccess(false)
  }, [unit])

  async function handleSearch() {
    if (searchEmail.length < 3) return
    setSearching(true)
    setError(null)
    try {
      const res = await fetch(`/api/tenants/search?email=${encodeURIComponent(searchEmail)}`)
      const data = await res.json()
      setSearchResults(data.tenants || [])
    } catch {
      setError("Search failed.")
    } finally {
      setSearching(false)
    }
  }

  async function handleAssign(tenantId: string | null) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/units/${unit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Update failed.")
        return
      }

      setSuccess(true)
      router.refresh()
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch {
      setError("Update failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <GlassCard className="relative w-full max-w-md border-none shadow-2xl p-0 overflow-hidden animate-in zoom-in-95 duration-200" hoverable={false}>
        <div className="p-6 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold">Manage Unit {unit.unitNumber}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Tenant Assignment</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {unit.tenant ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {unit.tenant.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm leading-none">{unit.tenant.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tight mt-1">{unit.tenant.email}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
                  onClick={() => handleAssign(null)}
                  disabled={loading}
                >
                  <UserMinus className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Find Tenant by Email</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter email address..." 
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="h-10 rounded-xl bg-background/50 border-muted/20"
                  />
                  <Button variant="brand" size="icon" className="h-10 w-10 shrink-0" onClick={handleSearch} disabled={searching}>
                    {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {searchResults.length > 0 ? (
                  searchResults.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleAssign(t.id)}
                      disabled={loading}
                      className="w-full p-3 rounded-xl border border-muted/20 bg-muted/5 hover:bg-primary/5 hover:border-primary/20 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-xs leading-none">{t.name}</p>
                          <p className="text-[10px] text-muted-foreground tracking-tight mt-0.5">{t.email}</p>
                        </div>
                      </div>
                      <UserPlus className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))
                ) : searchEmail.length >= 3 && !searching && (
                  <p className="text-center py-4 text-xs text-muted-foreground italic">No tenants found for this email.</p>
                )}
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs font-bold text-destructive text-center uppercase tracking-tight">{error}</p>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-primary uppercase tracking-widest animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" /> Updating Assignment...
            </div>
          )}

          {success && (
            <p className="text-xs font-bold text-success text-center uppercase tracking-tight">Assignment successfully updated</p>
          )}
        </div>
      </GlassCard>
    </div>
  )
}
