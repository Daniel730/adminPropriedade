import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge"
import { RequestStatus } from "@/lib/types"
import { GlassCard } from "@/components/ui/GlassCard"
import { Wrench, Calendar, Building2, ChevronRight, Inbox, CheckCircle2, Star, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function VendorRequestsPage() {
  const session = await auth()
  if (!session || session.user.role !== "VENDOR") redirect("/login")

  const requests = await prisma.maintenanceRequest.findMany({
    where: { vendorId: session.user.id },
    include: {
      unit: { include: { property: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  // Calculate Vendor Metrics
  const totalTasks = requests.length
  const completedTasks = requests.filter(r => r.status === RequestStatus.RESOLVED).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  const ratedRequests = requests.filter(r => r.vendorRating !== null)
  const rating = ratedRequests.length > 0 
    ? ratedRequests.reduce((sum, r) => sum + (r.vendorRating || 0), 0) / ratedRequests.length 
    : 0

  // Financial metrics
  const totalEarnedCents = requests.reduce((sum, r) => sum + (r.finalCostCents || 0), 0)
  const avgJobValue = completedTasks > 0 ? (totalEarnedCents / 100 / completedTasks).toFixed(2) : "0.00"

  return (
    <div className="space-y-8 animate-page-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Service Requests
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Manage your assigned maintenance tasks and updates.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 group cursor-pointer hover:bg-emerald-500/20 transition-all">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
              Set Available
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary/10 border border-secondary/20">
            <Wrench className="h-4 w-4 text-secondary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-secondary/80">
              Vendor Portal
            </span>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <GlassCard className="p-6 border-none shadow-xl shadow-primary/5 bg-gradient-to-r from-primary/5 via-transparent to-transparent flex items-center justify-between" hoverable={false}>
        <div className="flex items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <TrendingUp className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Lifetime Earnings</p>
            <h3 className="text-3xl font-bold tracking-tight">${(totalEarnedCents / 100).toLocaleString()}</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Avg. Per Job</p>
          <p className="text-xl font-bold text-primary font-mono">${avgJobValue}</p>
        </div>
      </GlassCard>

      {/* Performance Dashboard */}
      <div className="grid gap-4 md:grid-cols-4">
        <GlassCard className="p-5 border-none shadow-xl shadow-primary/5">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <Wrench className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-black uppercase tracking-widest">Total Assigned</h3>
          </div>
          <p className="text-3xl font-bold">{totalTasks}</p>
        </GlassCard>
        
        <GlassCard className="p-5 border-none shadow-xl shadow-primary/5">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <h3 className="text-xs font-black uppercase tracking-widest">Completed</h3>
          </div>
          <p className="text-3xl font-bold">{completedTasks}</p>
        </GlassCard>

        <GlassCard className="p-5 border-none shadow-xl shadow-primary/5">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <h3 className="text-xs font-black uppercase tracking-widest">Completion Rate</h3>
          </div>
          <p className="text-3xl font-bold">{completionRate}%</p>
        </GlassCard>

        <GlassCard className="p-5 border-none shadow-xl shadow-primary/5">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <Star className="h-4 w-4 text-amber-500" />
            <h3 className="text-xs font-black uppercase tracking-widest">Vendor Rating</h3>
          </div>
          <p className="text-3xl font-bold">{rating > 0 ? rating.toFixed(1) : "N/A"}</p>
        </GlassCard>
      </div>

      <div className="grid gap-4">
        {requests.length === 0 ? (
          <GlassCard className="py-20 text-center" hoverable={false}>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <Inbox className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold tracking-tight">No tasks assigned</p>
                <p className="text-muted-foreground text-sm">You&apos;re all caught up! New requests will appear here.</p>
              </div>
            </div>
          </GlassCard>
        ) : (
          requests.map((req) => (
            <Link key={req.id} href={`/vendor/requests/${req.id}`} className="block group">
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
                          <span>Assigned {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                      <RequestStatusBadge status={req.status as RequestStatus} className="sm:hidden w-fit mt-2" />
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-none pt-4 sm:pt-0">
                      <div className="sm:hidden text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Update Task
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
