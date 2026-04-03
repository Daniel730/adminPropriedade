# Skill: saas-stripe-lifecycle
## Goal: Manage the complex "Subscription State Machine."
## Instructions:
- Handle all Stripe webhook events: `checkout.session.completed`, `invoice.payment_failed` (Grace Period), `customer.subscription.deleted` (Restriction).
- Logic must always check `subscription.status` before permitting "Write" operations.
- Implement "Downgrade Protection": ensure data isn't lost but becomes read-only if a user moves to a lower tier.
