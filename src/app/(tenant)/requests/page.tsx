import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge"
import { RequestStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Plus, Building2, ArrowRight, Wrench } from "lucide-react"
import { TenantAnnouncements } from "@/components/properties/TenantAnnouncements"

export default async function TenantRequestsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const requests = await prisma.maintenanceRequest.findMany({
    where: { tenantId: session.user.id },
    include: { unit: { include: { property: true } } },
    orderBy: { createdAt: "desc" },
  })

  const unit = await prisma.unit.findUnique({
    where: { tenantId: session.user.id },
    select: { propertyId: true }
  })

  const openCount = requests.filter(r => r.status !== RequestStatus.RESOLVED).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Requests</h1>
          <p className="text-muted-foreground mt-1">
            Track your maintenance tickets
          </p>
        </div>
        <Button asChild>
          <Link href="/requests/new">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Link>
        </Button>
      </div>

      {unit && <TenantAnnouncements propertyId={unit.propertyId} />}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wrench className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{requests.length}</p>
              <p className="text-xs text-muted-foreground">Total Requests</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${openCount > 0 ? 'bg-warning/10' : 'bg-success/10'}`}>
              <Wrench className={`h-4 w-4 ${openCount > 0 ? 'text-warning' : 'text-success'}`} />
            </div>
            <div>
              <p className="text-2xl font-semibold">{openCount}</p>
              <p className="text-xs text-muted-foreground">Open</p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
            <Wrench className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No requests yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Everything looks good! Need something fixed?
          </p>
          <Button asChild>
            <Link href="/requests/new">Submit a Request</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <Link 
              key={req.id} 
              href={`/requests/${req.id}`}
              className="block bg-card border rounded-xl p-4 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                      {req.title}
                    </h3>
                    <RequestStatusBadge status={req.status as RequestStatus} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{req.unit.property.name} - Unit {req.unit.unitNumber}</span>
                    </div>
                    <span>{new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
