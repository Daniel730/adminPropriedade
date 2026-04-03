import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables.")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-03-25.dahlia", // Use latest or pinned version
  typescript: true,
})

/**
 * Note for Webhook Handler:
 * Stripe webhooks require the raw request body for signature verification.
 * In Next.js App Router, use `await req.text()` to get the raw body.
 */
