import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Star, Zap } from "lucide-react"

export default async function ReportsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const managerId = session.user.id

  // 1. Get total revenue (Current MRR)
  const revenueResult = await prisma.unit.aggregate({
    where: { property: { managerId }, tenantId: { not: null } },
    _sum: { monthlyRentCents: true }
  })
  const monthlyRevenue = (revenueResult._sum.monthlyRentCents || 0) / 100

  // 2. Get maintenance costs
  const requests = await prisma.maintenanceRequest.findMany({
    where: { 
      unit: { property: { managerId } },
      status: "RESOLVED",
      finalCostCents: { not: null }
    },
    select: { finalCostCents: true, vendorRating: true, vendor: { select: { name: true } } }
  })

  let totalMaintCost = 0
  const vendorPerformance: Record<string, { totalRating: number, count: number }> = {}

  for (const req of requests) {
    if (req.finalCostCents) {
      totalMaintCost += req.finalCostCents / 100
    }
    if (req.vendorRating && req.vendor?.name) {
      const vName = req.vendor.name
      if (!vendorPerformance[vName]) vendorPerformance[vName] = { totalRating: 0, count: 0 }
      vendorPerformance[vName].totalRating += req.vendorRating
      vendorPerformance[vName].count += 1
    }
  }

  const vendorsAverages = Object.entries(vendorPerformance).map(([name, data]) => ({
    name,
    avg: data.count > 0 ? (data.totalRating / data.count).toFixed(1) : "N/A",
    count: data.count
  })).sort((a, b) => Number(b.avg) - Number(a.avg))

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Financial performance and maintenance insights across your portfolio.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Monthly Revenue (MRR)</p>
              <h2 className="text-3xl font-bold">${monthlyRevenue.toLocaleString()}</h2>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-success text-sm font-medium">
            <TrendingUp className="h-4 w-4" /> Stable cash flow
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Maintenance Cost</p>
              <h2 className="text-3xl font-bold">${totalMaintCost.toLocaleString()}</h2>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
            <Zap className="h-4 w-4" /> Lifetime expenditure
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Portfolio Rating</p>
              <h2 className="text-3xl font-bold">
                {vendorsAverages.length > 0 
                  ? (vendorsAverages.reduce((a, b) => a + Number(b.avg), 0) / vendorsAverages.length).toFixed(1) 
                  : "N/A"
                } <span className="text-xl text-muted-foreground font-normal">/ 5.0</span>
              </h2>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
            Based on {requests.filter(r => r.vendorRating).length} resolved tickets
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top vendors */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Top Performing Vendors</h3>
          {vendorsAverages.length === 0 ? (
            <p className="text-muted-foreground text-sm">No vendor ratings recorded yet. Resolve tickets and leave ratings to populate this area.</p>
          ) : (
            <div className="space-y-4">
              {vendorsAverages.map((v, i) => (
                <div key={v.name} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium">{v.name}</p>
                      <p className="text-xs text-muted-foreground">{v.count} total jobs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-yellow-500 text-lg">
                    {v.avg} <Star className="h-4 w-4 fill-yellow-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
            <TrendingDown className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Financial Efficiency</h3>
            <p className="text-sm text-muted-foreground">Keep your maintenance costs below 10% of your total MRR to maintain healthy property margins. Use top-rated vendors to ensure jobs are done right the first time.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
