import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const unreadOnly = searchParams.get("unread") === "true"
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10))

  const where = {
    userId: session.user.id,
    ...(unreadOnly ? { read: false } : {}),
  }

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.notification.count({
      where: { userId: session.user.id, read: false },
    }),
  ])

  return NextResponse.json({
    data: notifications,
    unreadCount,
  })
}
