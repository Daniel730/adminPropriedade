import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const announcements = await prisma.announcement.findMany({
    where: { propertyId: id },
    include: {
      author: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  return NextResponse.json(announcements)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== "MANAGER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { title, body } = await req.json()

  if (!title || !body) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const property = await prisma.property.findUnique({ where: { id } })
  if (!property || property.managerId !== session.user.id) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 403 })
  }

  const announcement = await prisma.announcement.create({
    data: {
      title,
      body,
      propertyId: id,
      authorId: session.user.id
    },
    include: {
      author: { select: { name: true } }
    }
  })

  return NextResponse.json(announcement)
}
