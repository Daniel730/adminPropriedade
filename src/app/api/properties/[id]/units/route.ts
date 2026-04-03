import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isAccountRestricted, getTotalUnitCount, getManagerSubscription } from "@/lib/subscription"
import { RequestStatus } from "@/lib/types"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (session.user.role !== "MANAGER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id: propertyId } = await params

  const property = await prisma.property.findUnique({ where: { id: propertyId } })
  if (!property || property.managerId !== session.user.id) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 })
  }

  const units = await prisma.unit.findMany({
    where: { propertyId },
    include: {
      tenant: { select: { id: true, name: true, email: true } },
      _count: {
        select: {
          requests: { where: { status: { not: RequestStatus.RESOLVED } } },
        },
      },
    },
    orderBy: { unitNumber: "asc" },
  })

  return NextResponse.json(units)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (session.user.role !== "MANAGER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id: propertyId } = await params

  const property = await prisma.property.findUnique({ where: { id: propertyId } })
  if (!property || property.managerId !== session.user.id) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 })
  }

  const restricted = await isAccountRestricted(session.user.id)
  if (restricted) {
    return NextResponse.json(
      { error: "Your account is restricted." },
      { status: 403 }
    )
  }

  const subscription = await getManagerSubscription(session.user.id)
  const unitLimit = subscription?.unitLimit ?? 2
  const totalUnits = await getTotalUnitCount(session.user.id)

  if (totalUnits >= unitLimit) {
    return NextResponse.json(
      { error: `Unit limit reached (${unitLimit} units). Upgrade your plan to add more.` },
      { status: 403 }
    )
  }

  const body = await req.json()
  const { unitNumber } = body

  if (!unitNumber) {
    return NextResponse.json({ error: "unitNumber is required." }, { status: 422 })
  }

  const existing = await prisma.unit.findFirst({
    where: { propertyId, unitNumber },
  })
  if (existing) {
    return NextResponse.json(
      { error: "Unit number already exists in this property." },
      { status: 422 }
    )
  }

  const unit = await prisma.unit.create({
    data: { propertyId, unitNumber },
  })

  return NextResponse.json(unit, { status: 201 })
}
