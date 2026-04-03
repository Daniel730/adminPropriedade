# Research: Property Management Automation

**Branch**: `001-property-mgmt-automation` | **Date**: 2026-04-02  
**Phase**: 0 — Technology Decisions

---

## Recommended Stack Summary

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL via Neon |
| ORM | Prisma |
| Auth | Auth.js v5 (Credentials provider) |
| Email | Resend + React Email |
| Payments | Stripe |
| UI | shadcn/ui + Tailwind CSS |
| Deployment | Vercel |

---

## 1. Full-Stack Framework

**Decision**: Next.js 15 (App Router)

**Rationale**: App Router React Server Components reduce client bundle size for the dashboard and list views, while Route Handlers cover the Stripe webhook endpoint and REST-style API surface. A single repository simplifies deployment, environment management, and team onboarding.

**Alternatives considered**: Remix (narrower Stripe/RSC ecosystem), Express + React SPA (two repos, CORS overhead), SvelteKit (less mature Auth.js and shadcn equivalents).

---

## 2. Database

**Decision**: PostgreSQL hosted on Neon

**Rationale**: PostgreSQL's relational model is the natural fit for property → unit → tenant → request → vendor relationships. Neon provides serverless PostgreSQL with branching for staging environments and a generous free tier, appropriate for a greenfield project.

**Alternatives considered**: MySQL/PlanetScale (removed free tier 2024), SQLite/Turso (concurrent writes complexity), MongoDB (unnecessary document flexibility for a relational domain).

---

## 3. ORM

**Decision**: Prisma

**Rationale**: Prisma's `schema.prisma` is a single source of truth for the data model with auto-generated type-safe query client, intuitive migration workflow (`prisma migrate dev`), and direct Next.js server component integration.

**Alternatives considered**: Drizzle ORM (more verbose schema, less polished migrations), Kysely (manual migrations), raw SQL (no type safety).

**Note**: Use `@prisma/adapter-neon` driver adapter (Prisma 5.4+) with Neon's WebSocket connection pooling to prevent serverless connection exhaustion.

---

## 4. Auth

**Decision**: Auth.js v5 (NextAuth.js v5) with Credentials provider

**Rationale**: First-class Next.js App Router and middleware support; `auth()` helper enables role-based route protection at the middleware level. Credentials provider supports email/password without SSO. Official `@auth/prisma-adapter` integrates the session store with the Prisma data model.

**Role encoding**: `role: "TENANT" | "MANAGER" | "VENDOR"` stored in the JWT session and checked in `middleware.ts` — not only in UI conditionals.

**Alternatives considered**: Clerk (per-MAU pricing, vendor lock-in), Lucia Auth (community-maintained Prisma adapter), custom JWT (high risk, unnecessary).

---

## 5. Email Notifications

**Decision**: Resend + React Email

**Rationale**: Resend's free tier (3,000 emails/month), React Email JSX templates with live preview, and official Node.js SDK make it the most developer-friendly transactional email choice. Notification templates (status changes, vendor assignment) benefit from component-based composition in the same React codebase.

**Alternatives considered**: SendGrid (complex dashboard, inferior template authoring), Nodemailer (requires managing own SMTP relay and deliverability), Postmark (no free tier).

---

## 6. Payments

**Decision**: Stripe (Checkout + Billing + Webhooks)

**Rationale**: Explicitly requested in the feature description. Stripe Checkout handles the subscription onboarding flow. Stripe Billing manages recurring payments and plan management. Webhooks (`invoice.payment_failed`, `invoice.payment_succeeded`, `customer.subscription.updated`) drive the grace period and restriction logic.

**Key integration notes**:
- Stripe webhook Route Handler at `app/api/webhooks/stripe/route.ts` requires raw body (`req.text()`).
- Unit count gating must be re-checked server-side on property/unit creation, not only at checkout.
- Store `stripe_customer_id` and `stripe_subscription_id` on the Subscription entity.

**Grace period state machine** (driven by Stripe webhooks):
```
ACTIVE → (invoice.payment_failed) → GRACE (7-day window)
GRACE → (payment resolved) → ACTIVE
GRACE → (7 days elapsed, no payment) → RESTRICTED (read-only)
RESTRICTED → (payment resolved) → ACTIVE
```

---

## 7. UI Components

**Decision**: shadcn/ui + Tailwind CSS

**Rationale**: shadcn/ui components are copied into the project (not a black-box dependency), enabling full ownership and customization — important for the dashboard's data tables, status badges, and filter panels. Tailwind co-locates styles with markup for fast responsive layout work.

**Alternatives considered**: MUI (bundle size, opinionated theming), Chakra UI (fallen behind in momentum), Mantine (strong runner-up but less Tailwind-native), Ant Design (heavy design opinions).

---

## 8. Deployment

**Decision**: Vercel

**Rationale**: Reference platform for Next.js with zero-configuration deployments, automatic PR preview environments (useful for testing Stripe webhook flows per branch), and edge middleware for Auth.js session checks. Free hobby tier for development; Pro tier (~$20/month) for early production.

**Alternatives considered**: Railway (good for co-hosting DB, weaker Next.js optimization), Fly.io (Dockerfile overhead), AWS Amplify (premature operational complexity), Render (limited Next.js feature support).

---

## Key Cross-Cutting Decisions

| Concern | Decision |
|---|---|
| Status transitions | Open → In Progress → Resolved; Resolved → Open only (enforced server-side) |
| Tenant data isolation | Tenants query only their own requests (row-level filtering by `tenant_id`) |
| Duplicate requests | All submissions accepted; manager resolves duplicates |
| Subscription enforcement | Unit count limit re-validated server-side on every unit creation mutation |
| Notification triggers | Status change → tenant; Resolved → manager; Vendor assigned → vendor |
| Grace period | 7 days full access after payment failure; then RESTRICTED (read-only) |
