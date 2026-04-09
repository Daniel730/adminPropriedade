import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { RequestStatus } from "@/lib/types"
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge"
import { RequestComments } from "@/components/requests/RequestComments"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Wrench, Calendar, Info, MapPin, CheckCircle2 } from "lucide-react"

export default async function TenantRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params

  const request = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: {
      unit: { include: { property: true } },
      vendor: { select: { name: true } },
    },
  })

  if (!request || request.tenantId !== session.user.id) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-page-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-primary/10 text-primary">
            <Link href="/requests" title="Back to my requests">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Request Details
            </h2>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest mt-0.5">
              Tracking ID: {request.id.slice(0, 8)}
            </p>
          </div>
        </div>
        <RequestStatusBadge status={request.status as RequestStatus} className="text-xs py-1.5 px-4" />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <GlassCard className="p-8 border-none shadow-2xl shadow-primary/5 space-y-8" hoverable={false}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Info className="h-4 w-4 text-primary/60" />
                <h3 className="text-xs font-black uppercase tracking-widest">Maintenance Issue</h3>
              </div>
              <p className="text-2xl font-bold text-foreground leading-tight">{request.title}</p>
              <div className="h-1 w-20 bg-primary/20 rounded-full mt-4" />
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Wrench className="h-3 w-3" /> Description
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 p-4 rounded-xl border border-muted/50">
                {request.description}
              </p>
            </div>

            <div className="pt-6 border-t border-muted/30 flex flex-wrap gap-6 text-xs font-bold uppercase tracking-tighter text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Submitted: {new Date(request.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Last Updated: {new Date(request.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
              </div>
            </div>
          </GlassCard>

          {request.status === RequestStatus.RESOLVED && (
            <GlassCard className="bg-emerald-500/5 border-emerald-500/20 p-6 flex items-center gap-4" hoverable={false}>
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">Issue Resolved</p>
                <p className="text-emerald-700/80 dark:text-emerald-400/80 text-sm">This maintenance request has been completed. If you encounter further issues, please submit a new request.</p>
              </div>
            </GlassCard>
          )}
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6 border-none shadow-xl shadow-primary/5 space-y-4" hoverable={false}>
            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 border-b border-primary/10 pb-3">
              <MapPin className="h-4 w-4" /> Location
            </h3>
            <div className="space-y-1">
              <p className="font-bold text-lg">{request.unit.property.name}</p>
              <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                Unit {request.unit.unitNumber}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-none shadow-xl shadow-primary/5 space-y-4" hoverable={false}>
            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 border-b border-primary/10 pb-3">
              <Wrench className="h-4 w-4" /> Assigned Vendor
            </h3>
            <div className="space-y-2">
              {request.vendor ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <User className="h-5 w-5" />
                  </div>
                  <p className="font-bold text-lg">{request.vendor.name}</p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-center">
                  <p className="text-amber-600/60 italic text-sm font-medium tracking-tight">Personnel Unassigned</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="mt-8">
        <RequestComments requestId={request.id} currentUserId={session.user.id} />
      </div>
    </div>
  )
}
