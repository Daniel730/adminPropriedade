import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { RequestStatus } from "@/lib/types"
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge"
import { UpdateRequestForm } from "@/components/requests/UpdateRequestForm"
import { RequestComments } from "@/components/requests/RequestComments"
import { getAllowedNextStatuses } from "@/lib/request-transitions"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Wrench, Calendar, Info, MapPin } from "lucide-react"

export default async function RequestDetailPage({
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
      tenant: { select: { name: true, email: true } },
      vendor: { select: { id: true, name: true } },
    },
  })

  if (!request || request.unit.property.managerId !== session.user.id) {
    notFound()
  }

  const vendors = await prisma.user.findMany({
    where: { role: "VENDOR", vendorManagerId: session.user.id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  const allowedTransitions = getAllowedNextStatuses(request.status as RequestStatus)

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-page-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-primary/10 text-primary">
            <Link href="/dashboard" title="Back to dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Request Details
            </h2>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest mt-0.5">
              Ref: {request.id.slice(0, 8)}
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
                <span>Updated: {new Date(request.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
              </div>
            </div>
          </GlassCard>

          <UpdateRequestForm
            requestId={request.id}
            currentStatus={request.status as RequestStatus}
            currentVendorId={request.vendor?.id ?? null}
            vendors={vendors}
            allowedTransitions={allowedTransitions}
          />
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6 border-none shadow-xl shadow-primary/5 space-y-4" hoverable={false}>
            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 border-b border-primary/10 pb-3">
              <MapPin className="h-4 w-4" /> Property Location
            </h3>
            <div className="space-y-1">
              <p className="font-bold text-lg">{request.unit.property.name}</p>
              <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                Unit {request.unit.unitNumber}
              </div>
              <p className="text-sm text-muted-foreground flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                {request.unit.property.address}
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-none shadow-xl shadow-primary/5 space-y-4" hoverable={false}>
            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 border-b border-primary/10 pb-3">
              <User className="h-4 w-4" /> Occupant Details
            </h3>
            <div className="space-y-2">
              <p className="font-bold text-lg">{request.tenant.name}</p>
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg border border-muted/30 break-all">
                {request.tenant.email}
              </p>
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
