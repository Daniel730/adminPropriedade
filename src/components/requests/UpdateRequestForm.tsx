"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RequestStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectItem,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { GlassCard } from "@/components/ui/GlassCard"
import { Edit3, Loader2, Save, UserPlus, Zap } from "lucide-react"

interface UpdateRequestFormProps {
  requestId: string
  currentStatus: RequestStatus
  currentVendorId: string | null
  vendors: { id: string; name: string }[]
  allowedTransitions: RequestStatus[]
  hideVendorAssignment?: boolean
}

export function UpdateRequestForm({
  requestId,
  currentStatus,
  currentVendorId,
  vendors,
  allowedTransitions,
  hideVendorAssignment = false,
}: UpdateRequestFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState<RequestStatus>(currentStatus)
  const [vendorId, setVendorId] = useState<string | "none">(currentVendorId ?? "none")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpdate() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          ...(hideVendorAssignment ? {} : { vendorId: vendorId === "none" ? null : vendorId }),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Failed to update request.")
        return
      }

      router.refresh()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const hasChanges = status !== currentStatus || (!hideVendorAssignment && (vendorId === "none" ? null : vendorId) !== currentVendorId)

  return (
    <GlassCard className="border-none shadow-2xl shadow-primary/5 p-8" hoverable={false}>
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
          <Edit3 className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Update Request</h3>
          <p className="text-sm text-muted-foreground">Modify the status and personnel assignments.</p>
        </div>
      </div>

      <div className="grid gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Zap className="h-3 w-3" /> New Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as RequestStatus)}
              disabled={loading}
              className="w-full h-11 rounded-xl bg-background/50 border-muted/20"
            >
              <SelectItem value={currentStatus} className="font-bold">{currentStatus} (Current)</SelectItem>
              {allowedTransitions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </Select>
          </div>

          {!hideVendorAssignment && (
            <div className="space-y-2">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <UserPlus className="h-3 w-3" /> Assign Vendor
              </Label>
              <Select
                value={vendorId}
                onValueChange={setVendorId}
                disabled={loading}
                className="w-full h-11 rounded-xl bg-background/50 border-muted/20"
              >
                <SelectItem value="none">Personnel Unassigned</SelectItem>
                {vendors.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
            {error}
          </div>
        )}

        <div className="pt-2 border-t border-muted/30">
          <Button
            onClick={handleUpdate}
            variant="brand"
            size="lg"
            className="w-full shadow-primary/20 group"
            disabled={loading || !hasChanges}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing Updates...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Commit Status Changes
              </>
            )}
          </Button>
          {!hasChanges && !loading && (
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4">
              No modifications detected
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
