import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { RequestFilters } from "@/components/requests/RequestFilters";
import { Building2, Wrench, Users, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, Banknote } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RequestStatus, SubscriptionStatus } from "@/lib/types";
import { getManagerSubscription } from "@/lib/subscription";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: string;
    positive: boolean;
  };
  href?: string;
}

function StatCard({ title, value, icon: Icon, trend, href }: StatCardProps) {
  const content = (
    <div className="stat-card bg-card border border-border rounded-xl p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend.positive ? "text-success" : "text-destructive"
            )}>
              {trend.positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trend.value}
            </div>
          )}
        </div>
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export default async function DashboardPage(props: { searchParams: Promise<{ propertyId?: string, status?: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const searchParams = await props.searchParams;
  const propertyIdParam = searchParams?.propertyId;
  const statusParam = searchParams?.status;

  const [properties, totalUnitsCount, activeRequests, recentRequests, subscription, allManagerProperties, occupiedUnitsCount, occupiedUnits] = await Promise.all([
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
    prisma.property.findMany({
      where: { managerId: session.user.id },
      select: { id: true, name: true }
    }),
    prisma.unit.count({
      where: { 
        property: { managerId: session.user.id },
        tenantId: { not: null }
      }
    }),
    prisma.unit.findMany({
      where: {
        property: { managerId: session.user.id },
        tenantId: { not: null }
      },
      select: { monthlyRentCents: true }
    })
  ]);

  const occupancyRate = totalUnitsCount > 0 ? Math.round((occupiedUnitsCount / totalUnitsCount) * 100) : 0;
  const isFullyOccupied = occupancyRate === 100;
  const totalRevenue = occupiedUnits.reduce((sum, u) => sum + (u.monthlyRentCents ?? 0), 0) / 100;

  const isRestricted = subscription?.status === SubscriptionStatus.RESTRICTED;
  const targetPropertyIds = propertyIdParam && propertyIdParam !== "all" 
    ? [propertyIdParam] 
    : allManagerProperties.map(p => p.id);
  
  const isSlaBreachedFilter = statusParam === "sla_breached";
  const statusFilter = statusParam && Object.values(RequestStatus).includes(statusParam as any) ? statusParam : undefined;

  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const filteredRequests = await prisma.maintenanceRequest.findMany({
    where: {
      unit: { propertyId: { in: targetPropertyIds } },
      ...(statusFilter && statusFilter !== "all" ? { status: statusFilter as RequestStatus } : {}),
      ...(isSlaBreachedFilter ? { 
        status: { not: RequestStatus.RESOLVED },
        createdAt: { lt: fortyEightHoursAgo }
      } : {}),
    },
    include: {
      unit: { include: { property: true } },
      tenant: { select: { name: true } },
      vendor: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back. Here&apos;s an overview of your portfolio.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {subscription && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">Pro Plan</span>
            </div>
          )}
          <Button asChild>
            <Link href="/properties/new">Add Property</Link>
          </Button>
        </div>
      </div>

      {/* Restricted Warning */}
      {isRestricted && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Subscription Restricted</p>
            <p className="text-sm opacity-90">Your account is restricted due to billing issues. Please update your payment method.</p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground" asChild>
            <Link href="/billing">Update Payment</Link>
          </Button>
        </div>
      )}
      
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Properties"
          value={properties}
          icon={Building2}
          trend={{ value: "Active", positive: true }}
          href="/properties"
        />
        <StatCard
          title="Total Units"
          value={totalUnitsCount}
          icon={Users}
          href="/properties"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon={TrendingUp}
          trend={isFullyOccupied ? { value: "Fully occupied", positive: true } : { value: `${totalUnitsCount - occupiedUnitsCount} empty`, positive: false }}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={Banknote}
          trend={{ value: "MRR", positive: true }}
        />
        <StatCard
          title="Active Requests"
          value={activeRequests}
          icon={Wrench}
          trend={activeRequests > 0 ? { value: `${activeRequests} pending`, positive: false } : undefined}
          href="/dashboard"
        />
      </div>

      {/* Recent Requests Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Recent Maintenance Requests</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Track and manage incoming requests</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="#all-requests" className="text-primary">
              View all
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        <DashboardTable requests={recentRequests} />
      </div>

      {/* Filterable Full Requests List */}
      <div id="all-requests" className="space-y-6 pt-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">All Requests</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage and filter all your portfolio requests</p>
        </div>
        <RequestFilters properties={allManagerProperties} />
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <DashboardTable requests={filteredRequests} />
        </div>
      </div>
    </div>
  );
}
