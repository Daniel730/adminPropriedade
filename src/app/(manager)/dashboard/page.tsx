import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { GlassCard } from "@/components/ui/GlassCard";
import { AdBanner } from "@/components/ui/AdBanner";
import { Building2, Wrench, Users, ArrowUpRight, ShieldAlert, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RequestStatus, SubscriptionStatus } from "@/lib/types";
import { getManagerSubscription } from "@/lib/subscription";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const [properties, totalUnitsCount, activeRequests, recentRequests, subscription] = await Promise.all([
    prisma.property.count({ where: { managerId: session.user.id } }),
    prisma.unit.count({ where: { property: { managerId: session.user.id } } }),
    prisma.maintenanceRequest.count({ 
      where: { 
        unit: { property: { managerId: session.user.id } },
        status: { not: RequestStatus.RESOLVED }
      } 
    }),
    prisma.maintenanceRequest.findMany({
      where: { unit: { property: { managerId: session.user.id } } },
      include: {
        unit: { include: { property: true } },
        tenant: { select: { name: true } },
        vendor: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    getManagerSubscription(session.user.id),
  ]);

  const isRestricted = subscription?.status === SubscriptionStatus.RESTRICTED;

  return (
    <div className="space-y-8 animate-page-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Manager Overview
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Monitor and manage your property portfolio efficiently.
          </p>
        </div>
        {subscription && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold uppercase tracking-widest text-primary/80">
              Pro Member
            </span>
          </div>
        )}
      </div>

      {isRestricted && (
        <GlassCard className="bg-destructive/5 border-destructive/20 text-destructive flex items-center gap-4 py-4" hoverable={false}>
          <ShieldAlert className="h-6 w-6 shrink-0" />
          <div>
            <p className="font-bold">Subscription Restricted</p>
            <p className="text-sm opacity-90">Your account is currently restricted due to billing issues. Please update your payment method.</p>
          </div>
        </GlassCard>
      )}

      {subscription?.adsEnabled && <AdBanner />}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
              <Building2 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Properties</p>
            <h3 className="text-3xl font-bold mt-1">{properties}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
            <Building2 className="h-24 w-24" />
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary transition-transform group-hover:scale-110">
              <Wrench className="h-6 w-6" />
            </div>
            {activeRequests > 0 && (
              <div className="flex items-center text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                Active
              </div>
            )}
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Requests</p>
            <h3 className="text-3xl font-bold mt-1">{activeRequests}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
            <Wrench className="h-24 w-24" />
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Units</p>
            <h3 className="text-3xl font-bold mt-1">{totalUnitsCount}</h3>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
            <Users className="h-24 w-24" />
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary transition-transform group-hover:scale-110">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Occupancy</p>
            <h3 className="text-3xl font-bold mt-1">100%</h3>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden border-none shadow-2xl shadow-primary/5">
        <div className="p-6 border-b bg-card/50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Recent Maintenance Requests</h3>
            <p className="text-sm text-muted-foreground">Monitor and manage high-priority tasks.</p>
          </div>
        </div>
        <DashboardTable requests={recentRequests} />
      </GlassCard>
    </div>
  );
}
