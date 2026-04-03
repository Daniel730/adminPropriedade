import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || session.user.role !== "MANAGER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { planId } = body

  if (!planId) {
    return NextResponse.json({ error: "planId is required" }, { status: 422 })
  }

  const plan = await prisma.subscriptionPlan.findUnique({
    where: { id: planId },
  })

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 })
  }

  if (!plan.stripePriceId) {
    // If it's a free plan, just return success (UI should prevent this, but handle for safety)
    return NextResponse.json({ 
      error: "This plan does not require a payment session.",
      info: "Free plans are active by default." 
    }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Allow switching plans even if active
  // if (user.subscription && user.subscription.status === "ACTIVE") {
  //   return NextResponse.json(
  //     { error: "Manager already has an active subscription" },
  //     { status: 400 }
  //   )
  // }

  let stripeCustomerId = user.subscription?.stripeCustomerId

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    })
    stripeCustomerId = customer.id
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId as string,
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.AUTH_URL}/billing?success=true`,
    cancel_url: `${process.env.AUTH_URL}/billing?canceled=true`,
    metadata: {
      userId: user.id,
      planId: plan.id,
    },
  })

  return NextResponse.json({ checkoutUrl: checkoutSession.url })
}
