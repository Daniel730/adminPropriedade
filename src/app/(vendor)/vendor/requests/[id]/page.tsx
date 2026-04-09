import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { RequestStatusBadge } from "@/components/requests/RequestStatusBadge"
import { UpdateRequestForm } from "@/components/requests/UpdateRequestForm"
import { RequestComments } from "@/components/requests/RequestComments"
import { getAllowedNextStatuses } from "@/lib/request-transitions"
import { RequestStatus } from "@/lib/types"

export default async function VendorRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session || session.user.role !== "VENDOR") redirect("/login")

  const { id } = await params

  const request = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: {
      unit: { include: { property: true } },
      tenant: { select: { name: true, email: true } },
    },
  })

  if (!request || request.vendorId !== session.user.id) {
    notFound()
  }

  const allowedTransitions = getAllowedNextStatuses(request.status as RequestStatus)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/vendor/requests"
            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200"
            title="Back to assignments"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Request Details</h1>
        </div>
        <RequestStatusBadge status={request.status as RequestStatus} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-lg border bg-white p-6 space-y-4 shadow-sm">
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Title
              </h2>
              <p className="text-lg font-semibold">{request.title}</p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">{request.description}</p>
            </div>
            <div className="pt-4 border-t flex justify-between text-sm text-gray-500">
              <p>Submitted: {new Date(request.createdAt).toLocaleString()}</p>
              <p>Last updated: {new Date(request.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          <UpdateRequestForm
            requestId={request.id}
            currentStatus={request.status as RequestStatus}
            currentVendorId={request.vendorId}
            vendors={[]} // Not needed for vendors
            allowedTransitions={allowedTransitions}
            hideVendorAssignment={true}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 space-y-4 shadow-sm">
            <h3 className="font-semibold border-b pb-2">Location</h3>
            <div>
              <p className="font-medium">{request.unit.property.name}</p>
              <p className="text-sm text-gray-500">Unit {request.unit.unitNumber}</p>
              <p className="text-sm text-gray-500">{request.unit.property.address}</p>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 space-y-4 shadow-sm">
            <h3 className="font-semibold border-b pb-2">Tenant</h3>
            <div>
              <p className="font-medium">{request.tenant.name}</p>
              <p className="text-sm text-gray-500">{request.tenant.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <RequestComments requestId={request.id} currentUserId={session.user.id} />
      </div>
    </div>
  )
}
