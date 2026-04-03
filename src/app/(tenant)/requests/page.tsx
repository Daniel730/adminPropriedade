import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge"
import { RequestStatus } from "@/lib/types"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Building2, ChevronRight, Inbox } from "lucide-react"

import { cn } from "@/lib/utils"

export default async function TenantRequestsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const requests = await prisma.maintenanceRequest.findMany({
    where: { tenantId: session.user.id },
    include: { unit: { include: { property: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            My Requests
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Track and manage your maintenance tickets.
          </p>
        </div>
        <Button asChild variant="brand" size="lg" className="shadow-primary/20">
          <Link href="/requests/new">
            <Plus className="mr-2 h-5 w-5" /> New Request
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {requests.length === 0 ? (
          <GlassCard className="py-20 text-center" hoverable={false}>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <Inbox className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold tracking-tight">No requests yet</p>
                <p className="text-muted-foreground text-sm">Everything looks good! Need something fixed?</p>
              </div>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/requests/new">Submit a Request</Link>
              </Button>
            </div>
          </GlassCard>
        ) : (
          requests.map((req) => (
            <Link key={req.id} href={`/requests/${req.id}`} className="block group">
              <GlassCard className="p-0 overflow-hidden border-none shadow-md group-hover:shadow-xl group-hover:shadow-primary/5 transition-all duration-300">
                <div className="flex flex-col sm:flex-row">
                  <div className={cn(
                    "w-2 sm:w-3 shrink-0",
                    req.status === RequestStatus.OPEN && "bg-amber-500",
                    req.status === RequestStatus.IN_PROGRESS && "bg-primary",
                    req.status === RequestStatus.RESOLVED && "bg-emerald-500",
                  )} />
                  
                  <div className="flex-1 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                          {req.title}
                        </h4>
                        <RequestStatusBadge status={req.status as RequestStatus} className="hidden sm:flex" />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-primary/60" />
                          <span>{req.unit.property.name} • {req.unit.unitNumber}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-primary/60" />
                          <span>{new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                      <RequestStatusBadge status={req.status as RequestStatus} className="sm:hidden w-fit mt-2" />
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-none pt-4 sm:pt-0">
                      <div className="sm:hidden text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Details
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
