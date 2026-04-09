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

  // In a real app we should verify the user has access to this specific request
  // (e.g. they are the tenant, manager, or assigned vendor).
  
  const comments = await prisma.requestComment.findMany({
    where: { requestId: id },
    include: {
      author: { select: { id: true, name: true, role: true } }
    },
    orderBy: { createdAt: "asc" }
  })

  return NextResponse.json(comments)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const { body } = await req.json()

  if (!body || typeof body !== "string") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const comment = await prisma.requestComment.create({
    data: {
      body,
      requestId: id,
      authorId: session.user.id
    },
    include: {
      author: { select: { id: true, name: true, role: true } }
    }
  })

  return NextResponse.json(comment)
}
