import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(_req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  await prisma.notification.updateMany({
    where: { 
      userId: session.user.id,
      read: false 
    },
    data: { read: true },
  })

  return NextResponse.json({ success: true })
}
