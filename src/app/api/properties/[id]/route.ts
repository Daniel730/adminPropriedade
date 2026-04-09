import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isAccountRestricted } from "@/lib/subscription"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "MANAGER") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      units: {
        include: {
          tenant: { select: { id: true, name: true, email: true } },
          _count: { select: { requests: true } }
        }
      }
    }
  })

  if (!property || property.managerId !== session.user.id) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }

  return NextResponse.json(property)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "MANAGER") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const restricted = await isAccountRestricted(session.user.id)
  if (restricted) return NextResponse.json({ error: "Account restricted" }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const { name, address } = body

  const property = await prisma.property.findUnique({ where: { id } })
  if (!property || property.managerId !== session.user.id) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }

  const updated = await prisma.property.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(address && { address })
    }
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "MANAGER") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params

  const property = await prisma.property.findUnique({ where: { id } })
  if (!property || property.managerId !== session.user.id) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }

  await prisma.property.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
