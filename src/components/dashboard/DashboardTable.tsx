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
import { Building2, User, ChevronRight, Calendar } from "lucide-react"

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
  }
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
      <div className="text-center py-20 text-muted-foreground bg-card/50 rounded-xl border border-dashed">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xl font-bold tracking-tight text-foreground">No requests found</p>
          <p className="text-sm">Try adjusting your filters or check back later.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile List View */}
      <div className="grid gap-4 md:hidden">
        {requests.map((req) => (
          <Link key={req.id} href={`/dashboard/requests/${req.id}`} className="block group">
            <div className="p-4 rounded-xl bg-card border shadow-sm group-hover:shadow-md transition-all active:scale-[0.98]">
              <div className="flex justify-between items-start mb-3">
                <RequestStatusBadge status={req.status as RequestStatus} />
                <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <h4 className="font-bold text-foreground mb-1 line-clamp-1">{req.title}</h4>
              <div className="space-y-1.5 mt-3 pt-3 border-t border-muted/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  <span>{req.unit.property.name} • Unit {req.unit.unitNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>{req.tenant.name}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-primary font-bold text-xs uppercase tracking-widest">
                <span>View Details</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-bold text-foreground">Property</TableHead>
              <TableHead className="font-bold text-foreground">Unit</TableHead>
              <TableHead className="font-bold text-foreground">Title</TableHead>
              <TableHead className="font-bold text-foreground">Tenant</TableHead>
              <TableHead className="font-bold text-foreground">Vendor</TableHead>
              <TableHead className="font-bold text-foreground">Status</TableHead>
              <TableHead className="font-bold text-foreground">Submitted</TableHead>
              <TableHead className="text-right font-bold text-foreground">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req.id} className="group transition-colors hover:bg-primary/5 border-muted/20">
                <TableCell className="font-medium">{req.unit.property.name}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-bold">
                    {req.unit.unitNumber}
                  </span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate font-semibold group-hover:text-primary transition-colors" title={req.title}>
                  {req.title}
                </TableCell>
                <TableCell className="text-sm">{req.tenant.name}</TableCell>
                <TableCell>
                  {req.vendor ? (
                    <span className="text-foreground font-medium">{req.vendor.name}</span>
                  ) : (
                    <span className="text-muted-foreground italic text-xs">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <RequestStatusBadge status={req.status as RequestStatus} />
                </TableCell>
                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                  {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-primary hover:text-primary-foreground">
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
