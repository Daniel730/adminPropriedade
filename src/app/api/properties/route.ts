import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isAccountRestricted } from "@/lib/subscription"
import { RequestStatus } from "@/lib/types"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (session.user.role !== "MANAGER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const properties = await prisma.property.findMany({
    where: { managerId: session.user.id },
    include: {
      _count: { select: { units: true } },
      units: {
        include: {
          _count: {
            select: {
              requests: { where: { status: { not: RequestStatus.RESOLVED } } },
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  })

  const result = properties.map((p) => ({
    id: p.id,
    name: p.name,
    address: p.address,
    unitCount: p._count.units,
    openRequestCount: p.units.reduce(
      (sum, u) => sum + u._count.requests,
      0
    ),
  }))

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (session.user.role !== "MANAGER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const restricted = await isAccountRestricted(session.user.id)
  if (restricted) {
    return NextResponse.json(
      { error: "Your account is restricted." },
      { status: 403 }
    )
  }

  const body = await req.json()
  const { name, address } = body

  if (!name || !address) {
    return NextResponse.json(
      { error: "name and address are required." },
      { status: 422 }
    )
  }

  const property = await prisma.property.create({
    data: { name, address, managerId: session.user.id },
  })

  return NextResponse.json(property, { status: 201 })
}
