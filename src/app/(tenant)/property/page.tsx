import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { GlassCard } from "@/components/ui/GlassCard"
import { Building2, Mail, User, MapPin, Calendar, Megaphone, Info } from "lucide-react"

export default async function TenantPropertyPage() {
  const session = await auth()
  if (!session || session.user.role !== "TENANT") redirect("/login")

  const unit = await prisma.unit.findFirst({
    where: { tenantId: session.user.id },
    include: {
      property: {
        include: {
          manager: { select: { name: true, email: true } },
          announcements: { 
            include: { author: { select: { name: true } } },
            orderBy: { createdAt: "desc" }, 
            take: 3 
          }
        }
      }
    },
  })

  if (!unit) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <GlassCard className="p-12 text-center border-none shadow-xl">
          <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h2 className="text-2xl font-bold">No Property Assigned</h2>
          <p className="text-muted-foreground mt-2 text-balance">
            Your account is not yet linked to a residential unit. Please contact the platform administrator or your property manager.
          </p>
        </GlassCard>
      </div>
    )
  }

  const { property } = unit

  return (
    <div className="space-y-8 animate-page-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            My Property
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Essential information about your home at {property.name}.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/20">
          <Building2 className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">
            Property ID: {property.id.slice(0, 8)}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Home Detail Card */}
        <GlassCard className="p-8 border-none shadow-xl shadow-primary/5 flex flex-col justify-between" hoverable={false}>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-primary">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Location Details</h3>
                <p className="text-sm text-muted-foreground">Property and Unit reference</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-muted/30">
                <span className="text-sm font-medium text-muted-foreground capitalize">Full Address</span>
                <span className="font-bold text-right max-w-[200px]">{property.address}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-muted/30">
                <span className="text-sm font-medium text-muted-foreground capitalize">Unit Number</span>
                <span className="px-3 py-1 rounded-xl bg-primary/10 text-primary font-bold">{unit.unitNumber}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm font-medium text-muted-foreground capitalize">Occupancy Status</span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Lease
                </span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Manager Contact Card */}
        <GlassCard className="p-8 border-none shadow-xl shadow-primary/5 space-y-6" hoverable={false}>
          <div className="flex items-center gap-4 text-secondary">
             <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Property Manager</h3>
                <p className="text-sm text-muted-foreground">Direct administrative support</p>
              </div>
          </div>

          <div className="p-6 rounded-2xl bg-muted/30 border border-muted/50 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-background border flex items-center justify-center text-sm font-bold">
                {property.manager.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold">{property.manager.name}</p>
                <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">Manager Profile</p>
              </div>
            </div>
            
            <div className="pt-2">
              <a 
                href={`mailto:${property.manager.email}`} 
                className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-secondary text-secondary-foreground font-bold hover:shadow-lg hover:shadow-secondary/20 transition-all"
              >
                <Mail className="h-4 w-4" />
                Contact via Email
              </a>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Announcements Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" /> Recent Announcements
        </h3>
        
        {property.announcements.length === 0 ? (
          <GlassCard className="p-10 text-center border-none shadow-md opacity-60">
            <p className="text-sm text-muted-foreground">No recent announcements from your property manager.</p>
          </GlassCard>
        ) : (
          <div className="grid gap-4">
            {property.announcements.map((ann) => (
              <GlassCard key={ann.id} className="p-6 border-none shadow-md border-l-4 border-l-primary" hoverable={false}>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-lg">{ann.title}</h4>
                    <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{ann.body}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground line-clamp-1">
                      {new Date(ann.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
