import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true }
  })

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, currentPassword, newPassword } = body

  const updateData: any = {}

  if (name) {
    updateData.name = name
  }

  if (currentPassword && newPassword) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 })
    }

    updateData.passwordHash = await bcrypt.hash(newPassword, 10)
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields provided" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: updateData
  })

  return NextResponse.json({ success: true })
}
