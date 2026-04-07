import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { RequestStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Building2, Plus, MapPin, Home, Wrench, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function PropertiesPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const properties = await prisma.property.findMany({
    where: { managerId: session.user.id },
    include: {
      _count: { select: { units: true } },
      units: {
        include: {
          _count: {
            select: {
              requests: { where: { status: { not: RequestStatus.RESOLVED } } },
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  })

  const propertiesWithCounts = properties.map((p) => ({
    ...p,
    unitCount: p._count.units,
    openRequestCount: p.units.reduce((sum, u) => sum + u._count.requests, 0),
  }))

  const totalUnits = propertiesWithCounts.reduce((sum, p) => sum + p.unitCount, 0)
  const totalRequests = propertiesWithCounts.reduce((sum, p) => sum + p.openRequestCount, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Properties</h1>
          <p className="text-muted-foreground mt-1">
            Manage your property portfolio
          </p>
        </div>
        <Button asChild>
          <Link href="/properties/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{properties.length}</p>
              <p className="text-xs text-muted-foreground">Properties</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Home className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{totalUnits}</p>
              <p className="text-xs text-muted-foreground">Total Units</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center",
              totalRequests > 0 ? "bg-destructive/10" : "bg-primary/10"
            )}>
              <Wrench className={cn(
                "h-4 w-4",
                totalRequests > 0 ? "text-destructive" : "text-primary"
              )} />
            </div>
            <div>
              <p className="text-2xl font-semibold">{totalRequests}</p>
              <p className="text-xs text-muted-foreground">Open Requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {propertiesWithCounts.length === 0 ? (
        <div className="bg-card border rounded-xl p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">No properties yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get started by adding your first property
          </p>
          <Button asChild>
            <Link href="/properties/new">Add Property</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {propertiesWithCounts.map((property) => (
            <Link 
              key={property.id} 
              href={`/properties/${property.id}`}
              className="group bg-card border rounded-xl p-5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                {property.openRequestCount > 0 && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-destructive/10 text-destructive">
                    {property.openRequestCount} open
                  </span>
                )}
              </div>
              
              <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                {property.name}
              </h3>
              
              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="line-clamp-1">{property.address}</span>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm">
                  <span className="font-medium">{property.unitCount}</span>
                  <span className="text-muted-foreground ml-1">units</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
