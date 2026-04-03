import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (session.user.role !== "MANAGER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")

  if (!email || email.length < 3) {
    return NextResponse.json({ tenants: [] })
  }

  const tenants = await prisma.user.findMany({
    where: {
      role: "TENANT",
      email: {
        contains: email,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    take: 5,
  })

  return NextResponse.json({ tenants })
}
