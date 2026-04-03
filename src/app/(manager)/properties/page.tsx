import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { RequestStatus } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/GlassCard"
import { Building2, Plus, MapPin, Home, Wrench, ChevronRight } from "lucide-react"
import { getManagerSubscription } from "@/lib/subscription"
import { AdBanner } from "@/components/ui/AdBanner"

export default async function PropertiesPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const subscription = await getManagerSubscription(session.user.id)

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

  const stats = [
    { label: "Total Properties", value: properties.length, icon: Building2, color: "text-primary" },
    { label: "Total Units", value: propertiesWithCounts.reduce((sum, p) => sum + p.unitCount, 0), icon: Home, color: "text-secondary" },
    { label: "Open Requests", value: propertiesWithCounts.reduce((sum, p) => sum + p.openRequestCount, 0), icon: Wrench, color: "text-destructive" },
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Properties Portfolio
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Manage and monitor your real estate assets in one place.
          </p>
        </div>
        <Button asChild variant="brand" size="lg" className="shadow-primary/20">
          <Link href="/properties/new">
            <Plus className="mr-2 h-5 w-5" /> Add Property
          </Link>
        </Button>
      </div>

      {subscription?.adsEnabled && <AdBanner />}

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, i) => (
          <GlassCard key={i} className="flex items-center gap-4 py-4 px-6 border-none shadow-xl shadow-primary/5">
            <div className={`p-3 rounded-2xl bg-muted/50 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {propertiesWithCounts.length === 0 ? (
          <GlassCard className="col-span-full py-20 text-center" hoverable={false}>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold tracking-tight">No properties found</p>
                <p className="text-muted-foreground">Get started by adding your first property.</p>
              </div>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/properties/new">Add Property</Link>
              </Button>
            </div>
          </GlassCard>
        ) : (
          propertiesWithCounts.map((p) => (
            <Link key={p.id} href={`/properties/${p.id}`} className="group block">
              <GlassCard className="h-full flex flex-col p-0 overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/10 relative">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <Building2 className="h-20 w-20 text-primary" />
                  </div>
                  <div className="absolute bottom-4 left-6">
                    <div className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm">
                      Property Asset
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                    {p.name}
                  </h4>
                  <div className="flex items-center text-muted-foreground text-sm mt-2">
                    <MapPin className="h-4 w-4 mr-1 text-primary/60 shrink-0" />
                    <span className="line-clamp-1">{p.address}</span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-primary/5 space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Total Units</p>
                      <p className="text-lg font-bold text-primary">{p.unitCount}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/5 space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Requests</p>
                      <p className="text-lg font-bold text-secondary">{p.openRequestCount}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center">
                      Manage property <ChevronRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="h-8 w-8 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <ChevronRight className="h-4 w-4" />
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
