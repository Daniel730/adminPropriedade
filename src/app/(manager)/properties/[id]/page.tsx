import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { RequestStatus } from "@/lib/types"
import PropertyDetailPageContent from "@/components/dashboard/PropertyDetailPageContent"

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const { id } = await params

  const property = await prisma.property.findUnique({
    where: { id, managerId: session.user.id },
    include: {
      units: {
        include: {
          tenant: { select: { id: true, name: true, email: true } },
          _count: {
            select: {
              requests: { where: { status: { not: RequestStatus.RESOLVED } } },
            },
          },
        },
        orderBy: { unitNumber: "asc" },
      },
    },
  })

  if (!property) {
    notFound()
  }

  // Convert types to match client component expectations if necessary
  const serializedProperty = {
    ...property,
    units: property.units.map(u => ({
      ...u,
      _count: {
        requests: u._count.requests
      }
    }))
  }

  return <PropertyDetailPageContent property={serializedProperty} />
}
