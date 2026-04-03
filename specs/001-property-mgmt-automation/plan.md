# Implementation Plan: Property Management Automation

**Branch**: `001-property-mgmt-automation` | **Date**: 2026-04-02 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-property-mgmt-automation/spec.md`

---

## Summary

A web-based property management SaaS that enables tenants to submit maintenance requests, managers to assign vendors and track status, automated email notifications on status changes, a filtered manager dashboard, and Stripe-powered subscription plans gated by unit count. Built on Next.js 15 (App Router) + TypeScript + PostgreSQL (Prisma) + Auth.js v5 + Stripe + Resend, deployed to Vercel.

---

## Technical Context

**Language/Version**: TypeScript (Node.js 20+)  
**Primary Dependencies**: Next.js 15 (App Router), Prisma 5.x, Auth.js v5, Stripe, Resend + React Email, shadcn/ui + Tailwind CSS  
**Storage**: PostgreSQL via Neon (serverless, connection pooling via `@prisma/adapter-neon`)  
**Testing**: Vitest (unit), Playwright (e2e), Prisma test database for integration tests  
**Target Platform**: Vercel (serverless / edge)  
**Project Type**: Full-stack web application (SaaS)  
**Performance Goals**: Dashboard filter results < 3s; notification delivery < 2 min; checkout flow < 5 min end-to-end  
**Constraints**: Tenant data isolation enforced at query level; unit count limits enforced server-side on every mutation; status transitions validated server-side before DB write  
**Scale/Scope**: Initial target ~100 Manager accounts; 3 subscription tiers (Starter 10 units, Growth 50, Professional 200)

---

## Constitution Check

*Constitution template is unfilled — no project-specific architectural gates defined.*  
*No violations to evaluate. Proceed.*

---

## Project Structure

### Documentation (this feature)

```text
specs/001-property-mgmt-automation/
├── plan.md              # This file
├── research.md          # Phase 0: technology decisions
├── data-model.md        # Phase 1: entity model + Prisma schema
├── quickstart.md        # Phase 1: developer onboarding guide
├── contracts/
│   └── api-contracts.md # Phase 1: REST endpoint contracts
└── tasks.md             # Phase 2 output (via /speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (tenant)/
│   │   ├── requests/page.tsx
│   │   ├── requests/new/page.tsx
│   │   └── layout.tsx
│   ├── (manager)/
│   │   ├── dashboard/page.tsx
│   │   ├── properties/page.tsx
│   │   ├── properties/[id]/page.tsx
│   │   ├── vendors/page.tsx
│   │   ├── billing/page.tsx
│   │   └── layout.tsx
│   ├── (vendor)/
│   │   ├── requests/page.tsx
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
│   ├── ui/                        # shadcn/ui components
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
│   ├── prisma.ts
│   ├── auth.ts
│   ├── stripe.ts
│   ├── resend.ts
│   ├── notifications.ts
│   └── request-transitions.ts
└── middleware.ts

prisma/
├── schema.prisma
├── migrations/
└── seed.ts

tests/
├── unit/
├── integration/
└── e2e/
```

**Structure Decision**: Single Next.js project (Option 2 — web app). No separate backend or mobile app in scope for v1. All API logic lives in Route Handlers under `app/api/`.

---

## Key Design Decisions

### Role-Based Access

Roles (`TENANT`, `MANAGER`, `VENDOR`) are encoded in the Auth.js JWT session and enforced at two layers:
1. `middleware.ts` — redirects unauthenticated/unauthorized routes before they reach page components
2. Route Handlers — re-verify role server-side before every mutation

### Status Transition Enforcement

All status changes pass through `lib/request-transitions.ts` which contains the allowed transition map:
- `OPEN → IN_PROGRESS` ✓
- `IN_PROGRESS → RESOLVED` ✓
- `RESOLVED → OPEN` ✓ (re-open)
- All other transitions → reject with 422

Transitions are enforced before the DB write and notification dispatch.

### Subscription & Unit Gating

Unit count is checked on every `POST /api/properties/:id/units` call against the manager's active `Subscription.unitLimit`. The check queries the database — it is not derived solely from the session to prevent stale limits.

### Billing State Machine

Driven by Stripe webhooks at `POST /api/webhooks/stripe`:
```
ACTIVE → GRACE (invoice.payment_failed) → grace_period_end = now + 7 days
GRACE  → ACTIVE (invoice.payment_succeeded)
GRACE  → RESTRICTED (cron or webhook check: grace_period_end < now)
RESTRICTED → ACTIVE (invoice.payment_succeeded)
```

In `RESTRICTED` state, write operations (new requests, status changes, new units) return `403`. Read operations remain available.

### Notification Dispatch

`lib/notifications.ts` is called after every successful status change or vendor assignment:

| Trigger | Recipients | Channel |
|---|---|---|
| → IN_PROGRESS | Tenant | Email |
| → RESOLVED | Tenant + Manager | Email |
| → OPEN (re-open) | Manager | Email |
| Vendor assigned | Vendor | Email |
| Payment failed | Manager | Email |
| Payment succeeded | Manager | Email |

Email templates built with React Email and sent via Resend SDK.

### Tenant Data Isolation

All Prisma queries for `MaintenanceRequest` from a Tenant session include `WHERE tenant_id = session.user.id`. This is enforced in the Route Handler, not the UI.

---

## Complexity Tracking

No constitution violations to justify.

---

## Artifacts Reference

| Artifact | Path | Purpose |
|---|---|---|
| Specification | `specs/001-property-mgmt-automation/spec.md` | Source of truth for requirements |
| Research | `specs/001-property-mgmt-automation/research.md` | Technology decisions |
| Data Model | `specs/001-property-mgmt-automation/data-model.md` | Entity model + Prisma schema |
| API Contracts | `specs/001-property-mgmt-automation/contracts/api-contracts.md` | REST endpoint definitions |
| Quickstart | `specs/001-property-mgmt-automation/quickstart.md` | Developer setup guide |
| Tasks | `specs/001-property-mgmt-automation/tasks.md` | Implementation tasks (via `/speckit.tasks`) |
