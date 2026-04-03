import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: { unitLimit: "asc" },
    })

    const formattedPlans = plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      unitLimit: plan.unitLimit,
      priceMonthly: plan.priceMonthyCents, // Price in cents
      currency: "usd",
    }))

    return NextResponse.json({ data: formattedPlans })
  } catch (error) {
    console.error("Failed to fetch billing plans:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
