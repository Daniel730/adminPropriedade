# Quickstart: Property Management Automation

**Branch**: `001-property-mgmt-automation` | **Date**: 2026-04-02

---

## Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- PostgreSQL database (Neon free tier recommended: https://neon.tech)
- Stripe account (test mode keys)
- Resend account (free tier: https://resend.com)

---

## 1. Initialize the Project

```bash
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

---

## 2. Install Dependencies

```bash
# Database & ORM
pnpm add prisma @prisma/client @prisma/adapter-neon @neondatabase/serverless

# Auth
pnpm add next-auth@beta @auth/prisma-adapter bcryptjs
pnpm add -D @types/bcryptjs

# Payments
pnpm add stripe

# Email
pnpm add resend react-email @react-email/components

# UI
pnpm add tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react
npx shadcn@latest init

# Dev tools
pnpm add -D prisma
```

---

## 3. Environment Variables

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Auth.js
AUTH_SECRET="generate-with: openssl rand -base64 32"
AUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Resend
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"
```

---

## 4. Initialize Prisma

```bash
npx prisma init
```

Copy the schema from `specs/001-property-mgmt-automation/data-model.md` into `prisma/schema.prisma`, then:

```bash
npx prisma migrate dev --name init
npx prisma db seed   # seeds SubscriptionPlan tiers
```

---

## 5. Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (tenant)/
│   │   ├── requests/page.tsx          # tenant: list own requests
│   │   ├── requests/new/page.tsx      # tenant: submit request
│   │   └── layout.tsx
│   ├── (manager)/
│   │   ├── dashboard/page.tsx         # manager: filtered request dashboard
│   │   ├── properties/page.tsx        # manager: property list
│   │   ├── properties/[id]/page.tsx   # manager: property detail + units
│   │   ├── vendors/page.tsx           # manager: vendor list + add
│   │   ├── billing/page.tsx           # manager: plan selection + portal
│   │   └── layout.tsx
│   ├── (vendor)/
│   │   ├── requests/page.tsx          # vendor: assigned requests
│   │   └── layout.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── requests/route.ts
│       ├── requests/[id]/route.ts
│       ├── properties/route.ts
│       ├── properties/[id]/units/route.ts
│       ├── units/[id]/route.ts
│       ├── vendors/route.ts
│       ├── billing/plans/route.ts
│       ├── billing/checkout/route.ts
│       ├── billing/portal/route.ts
│       ├── notifications/route.ts
│       ├── notifications/[id]/read/route.ts
│       └── webhooks/stripe/route.ts
├── components/
│   ├── ui/                            # shadcn/ui components
│   ├── requests/
│   │   ├── RequestCard.tsx
│   │   ├── RequestForm.tsx
│   │   ├── RequestStatusBadge.tsx
│   │   └── RequestFilters.tsx
│   ├── dashboard/
│   │   └── DashboardTable.tsx
│   └── notifications/
│       └── NotificationBell.tsx
├── lib/
│   ├── prisma.ts                      # Prisma client singleton
│   ├── auth.ts                        # Auth.js config
│   ├── stripe.ts                      # Stripe client
│   ├── resend.ts                      # Resend client
│   ├── notifications.ts               # Notification trigger logic
│   └── request-transitions.ts        # Status transition validator
└── middleware.ts                      # Role-based route protection
```

---

## 6. Role-Based Route Protection

`middleware.ts` redirects users to their role-appropriate area:

```typescript
// Tenant  → /requests
// Manager → /dashboard
// Vendor  → /requests (vendor view)
```

Unauthenticated requests to protected routes are redirected to `/login`.

---

## 7. Status Transition Validation

All status changes go through `lib/request-transitions.ts` which enforces the allowed state machine before any database write or notification dispatch.

---

## 8. Stripe Webhook Setup (local development)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret output into `STRIPE_WEBHOOK_SECRET`.

---

## 9. Run Locally

```bash
pnpm dev
```

Visit `http://localhost:3000`. Create a Manager account, set up a property, add units, and invite a tenant to test the full maintenance request flow.

---

## 10. Deploy to Vercel

```bash
vercel --prod
```

Add all `.env.local` variables to Vercel project settings. Register the production webhook URL (`https://yourdomain.com/api/webhooks/stripe`) in the Stripe dashboard.
