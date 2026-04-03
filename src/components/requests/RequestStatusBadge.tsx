"use client"

import { RequestStatus } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Hammer, CheckCircle2, CircleDashed } from "lucide-react"

interface RequestStatusBadgeProps {
  status: RequestStatus
  className?: string
}

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  OPEN: {
    label: "Open",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15",
    icon: CircleDashed,
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
    icon: Hammer,
  },
  RESOLVED: {
    label: "Resolved",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15",
    icon: CheckCircle2,
  },
}

export function RequestStatusBadge({ status, className }: RequestStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-bold uppercase tracking-widest text-[10px] py-0.5 px-2 rounded-full flex items-center gap-1.5 transition-all", 
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={3} />
      {config.label}
    </Badge>
  )
}
