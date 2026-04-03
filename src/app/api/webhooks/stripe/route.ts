/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { notifyBilling } from "@/lib/notifications"
import { SubscriptionStatus } from "@/lib/types"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = (await headers()).get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const session = event.data.object as any

  switch (event.type) {
    case "checkout.session.completed": {
      const subscription = (await stripe.subscriptions.retrieve(
        session.subscription as string
      )) as any
      const userId = session.metadata.userId
      const planId = session.metadata.planId

      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId },
      })

      if (!plan) break

      await prisma.subscription.upsert({
        where: { managerId: userId },
        update: {
          planId: plan.id,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          status: SubscriptionStatus.ACTIVE,
          unitLimit: plan.unitLimit,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        create: {
          managerId: userId,
          planId: plan.id,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          status: SubscriptionStatus.ACTIVE,
          unitLimit: plan.unitLimit,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      })
      break
    }

    case "invoice.payment_succeeded": {
      const subscriptionId = (session as any).subscription as string
      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscriptionId },
      })

      if (subscription) {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: SubscriptionStatus.ACTIVE,
            gracePeriodEnd: null,
          },
        })
        await notifyBilling(subscription.managerId, "resolved")
      }
      break
    }

    case "invoice.payment_failed": {
      const subscriptionId = (session as any).subscription as string
      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscriptionId },
      })

      if (subscription) {
        const gracePeriodEnd = new Date()
        gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7)

        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: SubscriptionStatus.GRACE,
            gracePeriodEnd,
          },
        })
        await notifyBilling(subscription.managerId, "failed", gracePeriodEnd)
      }
      break
    }

    case "customer.subscription.updated": {
      const stripeSub = event.data.object as any
      const plan = await prisma.subscriptionPlan.findFirst({
        where: { stripePriceId: stripeSub.items.data[0].price.id },
      })

      if (plan) {
        await prisma.subscription.update({
          where: { stripeSubscriptionId: stripeSub.id },
          data: {
            planId: plan.id,
            unitLimit: plan.unitLimit,
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
          },
        })
      }
      break
    }

    case "customer.subscription.deleted": {
      const stripeSub = event.data.object as any
      await prisma.subscription.update({
        where: { stripeSubscriptionId: stripeSub.id },
        data: {
          status: SubscriptionStatus.RESTRICTED,
        },
      })
      break
    }
  }

  return NextResponse.json({ received: true })
}
