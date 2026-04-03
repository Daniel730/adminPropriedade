import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { RequestForm } from "@/components/requests/RequestForm"
import { GlassCard } from "@/components/ui/GlassCard"
import { Building2, ShieldAlert, Sparkles } from "lucide-react"

export default async function NewRequestPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const unit = await prisma.unit.findFirst({
    where: { tenantId: session.user.id },
    include: { property: true },
  })

  if (!unit) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-page-in">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent text-center">
          Maintenance Request
        </h2>
        <GlassCard className="bg-destructive/5 border-destructive/20 text-destructive flex items-center gap-6 p-8" hoverable={false}>
          <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold">Unassigned Account</p>
            <p className="opacity-90">No residential unit is currently assigned to your account. Please contact your property manager to resolve this.</p>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-page-in">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/20 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">
            Priority Support
          </span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Submit Request
        </h2>
        <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/30 w-fit mx-auto px-4 py-1.5 rounded-full border">
          <Building2 className="h-4 w-4 text-primary/60" />
          <p className="text-sm font-bold">
            {unit.property.name} <span className="mx-1 opacity-30">•</span> Unit {unit.unitNumber}
          </p>
        </div>
      </div>

      <RequestForm unitId={unit.id} />
    </div>
  )
}
