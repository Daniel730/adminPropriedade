import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge"
import { RequestStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Building2, User, ChevronRight, AlertOctagon } from "lucide-react"

interface Request {
  id: string
  title: string
  status: string
  createdAt: string | Date
  unit: {
    unitNumber: string
    property: {
      name: string
    }
  }
  tenant: {
    name: string
  } | null
  vendor: {
    name: string
  } | null
}

interface DashboardTableProps {
  requests: Request[]
}

export function DashboardTable({ requests }: DashboardTableProps) {
  if (requests.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">No maintenance requests found</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile List View */}
      <div className="grid gap-3 md:hidden p-4">
        {requests.map((req) => (
          <Link key={req.id} href={`/dashboard/requests/${req.id}`} className="block group">
            <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">{req.title}</h4>
                    {req.status !== RequestStatus.RESOLVED && (new Date().getTime() - new Date(req.createdAt).getTime() > 48 * 60 * 60 * 1000) && (
                      <AlertOctagon className="h-4 w-4 text-destructive" title="SLA Breached (>48h)" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {req.unit.property.name} - Unit {req.unit.unitNumber}
                  </p>
                </div>
                <RequestStatusBadge status={req.status as RequestStatus} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{req.tenant?.name || 'Unassigned'}</span>
                <div className="flex items-center gap-1 text-primary text-xs font-medium">
                  View
                  <ChevronRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Property</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Unit</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Title</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Tenant</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Vendor</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
              <TableHead className="text-right text-xs font-medium text-muted-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {req.unit.property.name}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-0.5 rounded bg-muted text-xs font-medium">
                    {req.unit.unitNumber}
                  </span>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="truncate block" title={req.title}>
                      {req.title}
                    </span>
                    {req.status !== RequestStatus.RESOLVED && (new Date().getTime() - new Date(req.createdAt).getTime() > 48 * 60 * 60 * 1000) && (
                      <AlertOctagon className="h-4 w-4 text-destructive shrink-0" title="SLA Breached (>48h)" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {req.tenant?.name || 'Unassigned'}
                  </div>
                </TableCell>
                <TableCell>
                  {req.vendor ? (
                    <span className="text-sm">{req.vendor.name}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <RequestStatusBadge status={req.status as RequestStatus} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/requests/${req.id}`}>
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
