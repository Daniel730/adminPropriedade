import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST() {
  const session = await auth()
  if (!session || session.user.role !== "MANAGER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const subscription = await prisma.subscription.findUnique({
    where: { managerId: session.user.id },
  })

  if (!subscription || !subscription.stripeCustomerId) {
    return NextResponse.json(
      { error: "No active subscription found" },
      { status: 400 }
    )
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${process.env.AUTH_URL}/billing`,
  })

  return NextResponse.json({ portalUrl: portalSession.url })
}
