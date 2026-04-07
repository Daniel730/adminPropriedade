"use client"

import { RequestStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface RequestStatusBadgeProps {
  status: RequestStatus
  className?: string
}

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; className: string }
> = {
  OPEN: {
    label: "Open",
    className: "bg-warning/10 text-warning",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-primary/10 text-primary",
  },
  RESOLVED: {
    label: "Resolved",
    className: "bg-success/10 text-success",
  },
}

export function RequestStatusBadge({ status, className }: RequestStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
