import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (session.user.role !== "MANAGER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const vendors = await prisma.user.findMany({
    where: {
      role: "VENDOR",
      vendorManagerId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: { name: "asc" },
  })

  return NextResponse.json(vendors)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (session.user.role !== "MANAGER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { name, email, password } = body

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "name, email, and password are required." },
      { status: 422 }
    )
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json(
      { error: "Email already in use." },
      { status: 422 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const vendor = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "VENDOR",
      vendorManagerId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  return NextResponse.json(vendor, { status: 201 })
}
