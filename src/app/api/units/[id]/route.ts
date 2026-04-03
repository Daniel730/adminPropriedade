import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
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

  const { id: unitId } = await params

  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: { property: true },
  })

  if (!unit || unit.property.managerId !== session.user.id) {
    return NextResponse.json({ error: "Unit not found." }, { status: 404 })
  }

  const body = await req.json()
  const { tenantId } = body

  // tenantId can be null to unassign
  if (tenantId !== null && tenantId !== undefined) {
    const tenant = await prisma.user.findUnique({
      where: { id: tenantId, role: "TENANT" },
    })

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found." }, { status: 422 })
    }
  }

  const updatedUnit = await prisma.unit.update({
    where: { id: unitId },
    data: { tenantId },
  })

  return NextResponse.json(updatedUnit)
}
