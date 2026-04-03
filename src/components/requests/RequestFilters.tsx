"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RequestStatus } from "@/lib/types"
import { GlassCard } from "@/components/ui/GlassCard"
import { Building2, CircleDashed, FilterX, Search } from "lucide-react"
import { Label } from "@/components/ui/label"

interface RequestFiltersProps {
  properties: { id: string; name: string }[]
}

export function RequestFilters({ properties }: RequestFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPropertyId = searchParams.get("propertyId") || "all"
  const currentStatus = searchParams.get("status") || "all"

  function updateFilters(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    // Reset to page 1 on filter change
    params.delete("page")
    router.push(`?${params.toString()}`)
  }

  function clearFilters() {
    router.push("/dashboard")
  }

  const hasFilters = searchParams.get("propertyId") || searchParams.get("status")

  return (
    <GlassCard className="flex flex-wrap items-end gap-6 p-6 border-none shadow-xl shadow-primary/5" hoverable={false}>
      <div className="space-y-2 flex-1 min-w-[240px]">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <Building2 className="h-3 w-3" /> Filter by Property
        </Label>
        <Select
          value={currentPropertyId}
          onValueChange={(v) => updateFilters("propertyId", v)}
          className="w-full h-11 rounded-xl bg-background/50 border-muted/20"
          placeholder="All Portfolio Assets"
        >
          <SelectItem value="all" className="font-bold text-primary">All Portfolio Assets</SelectItem>
          {properties.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="space-y-2 min-w-[180px]">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <CircleDashed className="h-3 w-3" /> Lifecycle Status
        </Label>
        <Select
          value={currentStatus}
          onValueChange={(v) => updateFilters("status", v)}
          className="w-full h-11 rounded-xl bg-background/50 border-muted/20"
          placeholder="Any Status"
        >
          <SelectItem value="all" className="font-bold text-primary">Any Status</SelectItem>
          {Object.values(RequestStatus).map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-2 pb-0.5">
        <Button
          variant="secondary"
          size="default"
          className="h-11 rounded-xl px-6"
          disabled={!hasFilters}
          onClick={() => {}} // Could trigger a re-search if needed
        >
          <Search className="h-4 w-4 mr-2" /> Apply
        </Button>
        {hasFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFilters}
            className="h-11 w-11 rounded-xl text-destructive hover:bg-destructive/10"
            title="Clear all filters"
          >
            <FilterX className="h-5 w-5" />
          </Button>
        )}
      </div>
    </GlassCard>
  )
}
