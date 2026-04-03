# Tasks: Property Management Automation

**Input**: Design documents from `/specs/001-property-mgmt-automation/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/api-contracts.md ✓

**Stack**: Next.js 15 (App Router) · TypeScript · PostgreSQL/Neon · Prisma · Auth.js v5 · Stripe · Resend · shadcn/ui

**Tests**: Not requested — test tasks are excluded per spec.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no shared dependencies)
- **[Story]**: Maps to user story from spec.md (US1–US5)

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Bootstrap the Next.js project, install all dependencies, scaffold directory structure.

- [X] T001 Initialize Next.js 15 project with TypeScript, Tailwind CSS, ESLint, App Router, and `src/` directory using `pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` in repository root
- [X] T002 Install all project dependencies: `prisma @prisma/client @prisma/adapter-neon @neondatabase/serverless next-auth@beta @auth/prisma-adapter bcryptjs @types/bcryptjs stripe resend react-email @react-email/components tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react` in `package.json`
- [X] T003 [P] Initialize shadcn/ui via `npx shadcn@latest init` and add core components: Button, Input, Badge, Table, Select, Card, DropdownMenu, Skeleton via `npx shadcn@latest add`
- [X] T004 [P] Create `.env.local` with all required environment variable placeholders: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`
- [X] T005 [P] Create full directory structure: `src/app/(auth)/login/`, `src/app/(tenant)/requests/new/`, `src/app/(manager)/dashboard/`, `src/app/(manager)/properties/[id]/`, `src/app/(manager)/vendors/`, `src/app/(manager)/billing/`, `src/app/(manager)/requests/[id]/`, `src/app/(vendor)/requests/`, `src/app/api/auth/[...nextauth]/`, `src/app/api/requests/[id]/`, `src/app/api/properties/[id]/units/`, `src/app/api/units/[id]/`, `src/app/api/vendors/`, `src/app/api/billing/plans/`, `src/app/api/billing/checkout/`, `src/app/api/billing/portal/`, `src/app/api/notifications/[id]/read/`, `src/app/api/webhooks/stripe/`, `src/components/ui/`, `src/components/requests/`, `src/components/dashboard/`, `src/components/notifications/`, `src/lib/`, `src/emails/`, `prisma/`, `tests/unit/`, `tests/integration/`, `tests/e2e/`

**Checkpoint**: Project initialized and all dependencies installable.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Data model, auth, middleware, and shared utilities that ALL user stories depend on. No user story can begin until this phase is complete.

**⚠️ CRITICAL**: Complete this phase before beginning any user story phase.

- [X] T006 Create `prisma/schema.prisma` with all 7 models (User, Property, Unit, MaintenanceRequest, Notification, SubscriptionPlan, Subscription) and all enums (Role, RequestStatus, SubscriptionStatus, NotificationType) exactly as defined in `specs/001-property-mgmt-automation/data-model.md`
- [X] T007 Run `npx prisma migrate dev --name init` to generate and apply the initial database migration against the Neon PostgreSQL instance
- [X] T008 Create `prisma/seed.ts` to insert the three SubscriptionPlan records (Starter: 10 units/$29, Growth: 50 units/$79, Professional: 200 units/$149) with placeholder `stripePriceId` values; run `npx prisma db seed`
- [X] T009 Create `src/lib/prisma.ts` as the Prisma client singleton using `@prisma/adapter-neon` for serverless WebSocket connection pooling; export as `prisma` default export
- [X] T010 Create `src/lib/auth.ts` with Auth.js v5 configuration: Credentials provider (email/password with bcrypt verify), `@auth/prisma-adapter` session store, JWT strategy encoding `id`, `email`, `name`, and `role` in the session token
- [X] T011 Create `src/app/api/auth/[...nextauth]/route.ts` exporting GET and POST handlers from Auth.js v5
- [X] T012 Create `src/middleware.ts` enforcing role-based route protection: unauthenticated users → `/login`; TENANT role → `/requests`; MANAGER role → `/dashboard`; VENDOR role → `/vendor/requests`; role mismatch redirects to correct area; RESTRICTED subscription status passes through (enforced at API level)
- [X] T013 Create `src/lib/request-transitions.ts` with the allowed status transition map and a `validateTransition(from: RequestStatus, to: RequestStatus): boolean` function enforcing: OPEN→IN_PROGRESS, IN_PROGRESS→RESOLVED, RESOLVED→OPEN (re-open only); all other transitions return false
- [X] T014 [P] Create `src/app/(auth)/layout.tsx` (minimal unauthenticated layout) and `src/app/(auth)/login/page.tsx` with email/password login form calling Auth.js `signIn("credentials", ...)`, showing error on invalid credentials
- [X] T015 [P] Create `src/components/requests/RequestStatusBadge.tsx` — maps RequestStatus enum values (OPEN/IN_PROGRESS/RESOLVED) to color-coded shadcn Badge variants (yellow/blue/green)
- [X] T016 [P] Create `src/lib/subscription.ts` — exports `getManagerSubscription(managerId: string)` querying the active Subscription record and returning `{ status, unitLimit, gracePeriodEnd }`; used by all API routes for RESTRICTED checks and unit limit enforcement

**Checkpoint**: Database schema applied, auth working, middleware protecting all routes, transition validator ready. User story implementation can now begin.

---

## Phase 3: User Story 1 — Tenant Submits Maintenance Request (Priority: P1) 🎯 MVP

**Goal**: Tenants can log in, submit maintenance requests, and track their status.

**Independent Test**: Log in as a tenant → submit a request with title and description → verify the request appears in the tenant's request list with status OPEN and a tracking reference.

- [X] T017 [US1] Implement `POST /api/requests` in `src/app/api/requests/route.ts`: authenticate session (TENANT role), verify `unitId` belongs to a unit where `tenant_id = session.user.id`, check Subscription status is not RESTRICTED, create `MaintenanceRequest` with status `OPEN`, return 201 with `{ id, title, status, createdAt }`
- [X] T018 [US1] Implement `GET /api/requests` (tenant branch) in `src/app/api/requests/route.ts`: for TENANT role, query `MaintenanceRequest` where `tenantId = session.user.id`, support `status` query param filter and pagination (`page`, `limit`), return paginated list with unit and property names
- [X] T019 [US1] Implement `GET /api/requests/:id` in `src/app/api/requests/[id]/route.ts`: for TENANT role, enforce `tenantId = session.user.id` — return 403 if request belongs to another tenant; return full request object including unit number and property name
- [X] T020 [P] [US1] Create `src/components/requests/RequestForm.tsx` — controlled form with `title` (text input), `description` (textarea), and `unitId` (hidden or pre-filled from session context); client component calling `POST /api/requests`; shows success confirmation with request `id` as tracking reference on 201
- [X] T021 [P] [US1] Create `src/app/(tenant)/layout.tsx` — tenant shell layout with navigation links (My Requests, Submit Request) and session guard (redirect non-TENANT roles)
- [X] T022 [US1] Create `src/app/(tenant)/requests/page.tsx` — server component fetching tenant's request list via `GET /api/requests`; renders list with `RequestStatusBadge`, request title, unit number, property name, and submission date; empty state message when no requests
- [X] T023 [US1] Create `src/app/(tenant)/requests/new/page.tsx` — page rendering `RequestForm` component; on successful submission redirects to `/requests` with success toast showing the tracking reference `id`

**Checkpoint**: Tenant can log in, submit a maintenance request, and see it in their list with OPEN status.

---

## Phase 4: User Story 2 — Manager Assigns Vendor and Updates Status (Priority: P1)

**Goal**: Managers can view requests for their properties, assign vendors, and progress request status through the allowed transitions.

**Independent Test**: Log in as a manager → view an existing open request → assign a vendor from the vendor list → change status to IN_PROGRESS → verify status persists and transition is enforced (OPEN→IN_PROGRESS allowed, IN_PROGRESS→OPEN rejected).

- [X] T024 [US2] Implement `PATCH /api/requests/:id` in `src/app/api/requests/[id]/route.ts`: authenticate session (MANAGER role), verify the request's unit belongs to a property owned by `session.user.id`, check Subscription not RESTRICTED, run `validateTransition` from `lib/request-transitions.ts` (return 422 with message on invalid transition), update `status` and/or `vendorId`, return updated request object
- [X] T025 [P] [US2] Implement `GET /api/properties` in `src/app/api/properties/route.ts`: return all properties where `managerId = session.user.id`, include `unitCount` and `openRequestCount` aggregates
- [X] T026 [P] [US2] Implement `POST /api/properties` in `src/app/api/properties/route.ts`: create new Property for session manager; check Subscription not RESTRICTED; return 201 with created property
- [X] T027 [P] [US2] Implement `GET /api/properties/:id/units` in `src/app/api/properties/[id]/units/route.ts`: return all units for a property owned by session manager; include tenant name/email and `openRequestCount` per unit
- [X] T028 [P] [US2] Implement `POST /api/properties/:id/units` in `src/app/api/properties/[id]/units/route.ts`: check Subscription not RESTRICTED; call `getManagerSubscription` and count current total units across all manager's properties — return 403 with upgrade prompt if at limit; create Unit with given `unitNumber`; return 201
- [X] T029 [P] [US2] Implement `PATCH /api/units/:id` in `src/app/api/units/[id]/route.ts`: assign (`tenantId: uuid`) or remove (`tenantId: null`) a tenant from a unit owned by session manager; validate `tenantId` references a TENANT role user if provided
- [X] T030 [P] [US2] Implement `GET /api/vendors` in `src/app/api/vendors/route.ts`: return all users with `role = VENDOR` linked to the session manager's account (introduce a `managerId` field on Vendor or scope by organization — use a `vendorManagerId` relation on User for vendor scoping)
- [X] T031 [P] [US2] Implement `POST /api/vendors` in `src/app/api/vendors/route.ts`: create a new User with `role = VENDOR`, hash the provided password with bcrypt, link to session manager via `vendorManagerId`; return created vendor object (without password hash)
- [X] T032 [US2] Create `src/app/(manager)/layout.tsx` — manager shell layout with navigation (Dashboard, Properties, Vendors, Billing) and session guard (redirect non-MANAGER roles)
- [X] T033 [P] [US2] Create `src/app/(manager)/properties/page.tsx` — list all manager properties with unit counts, open request counts, and a quick-create property form (name, address)
- [X] T034 [P] [US2] Create `src/app/(manager)/properties/[id]/page.tsx` — property detail: unit list with tenant assignment controls (assign/remove tenant), add-unit form, link to unit's open requests
- [X] T035 [P] [US2] Create `src/app/(manager)/vendors/page.tsx` — vendor list showing name and email; form to add a new vendor (name, email, temporary password)
- [X] T036 [US2] Create `src/app/(manager)/requests/[id]/page.tsx` — request detail page: shows request title, description, current status, tenant name, unit/property; status change dropdown populated only with valid next transitions from `lib/request-transitions.ts`; vendor assignment select dropdown from `GET /api/vendors`; submit calls `PATCH /api/requests/:id`
- [X] T037 [US2] Create `src/app/(manager)/dashboard/page.tsx` — basic server component listing all requests across manager's properties (using `GET /api/requests`); shows property, unit, status badge, vendor (if assigned), and link to request detail; no filters yet (added in US4)

**Checkpoint**: Manager can view all requests, assign vendors, and move requests through valid status transitions. Invalid transitions are rejected. Unit count is enforced when adding units.

---

## Phase 5: User Story 3 — Notifications on Status Change (Priority: P2)

**Goal**: Tenants, managers, and vendors automatically receive email notifications on status changes and vendor assignments.

**Independent Test**: Change a request status from OPEN to IN_PROGRESS → verify tenant receives an email with the request title and new status within 2 minutes.

- [X] T038 [US3] Create `src/lib/resend.ts` — initialize Resend client with `RESEND_API_KEY`; export `resendClient` instance and `FROM_EMAIL` constant from `EMAIL_FROM` env var
- [X] T039 [P] [US3] Create React Email templates: `src/emails/StatusChangeEmail.tsx` (props: tenantName, requestTitle, newStatus, requestId), `src/emails/VendorAssignedEmail.tsx` (props: vendorName, requestTitle, unitNumber, propertyName, requestId), `src/emails/BillingEmail.tsx` (props: managerName, eventType: 'failed'|'resolved', gracePeriodEnd?)
- [X] T040 [US3] Create `src/lib/notifications.ts` — exports four async functions: `notifyStatusChange(requestId, newStatus)` (creates Notification DB record + sends StatusChangeEmail to tenant; additionally sends to manager if RESOLVED), `notifyVendorAssigned(requestId, vendorId)` (creates Notification DB record + sends VendorAssignedEmail to vendor), `notifyReopen(requestId)` (creates Notification DB record for manager), `notifyBilling(managerId, eventType, gracePeriodEnd?)` (creates BILLING Notification + sends BillingEmail); all functions use `prisma` from `lib/prisma.ts` and `resendClient` from `lib/resend.ts`
- [X] T041 [US3] Wire notification calls into `PATCH /api/requests/:id` in `src/app/api/requests/[id]/route.ts`: after successful DB update, call `notifyStatusChange` on any status change and `notifyVendorAssigned` when `vendorId` changes (new assignment only); notifications are fire-and-forget (do not block response)
- [X] T042 [P] [US3] Implement `GET /api/notifications` in `src/app/api/notifications/route.ts`: return current user's notifications ordered by `createdAt` DESC; support `unread=true` query param; include `unreadCount` in response; limit to 20 per page
- [X] T043 [P] [US3] Implement `PATCH /api/notifications/:id/read` in `src/app/api/notifications/[id]/read/route.ts`: set `read = true` for notification where `id = :id` and `userId = session.user.id`; return `{ read: true }`
- [X] T044 [US3] Create `src/components/notifications/NotificationBell.tsx` — client component: bell icon with red badge showing `unreadCount` (fetched from `GET /api/notifications`); dropdown listing recent notifications with type label, message, and `createdAt`; clicking a notification calls `PATCH .../read` and optionally navigates to the related request; integrate into manager and tenant layouts

**Checkpoint**: Status changes and vendor assignments automatically send emails. Notification bell shows unread count in the UI.

---

## Phase 6: User Story 4 — Dashboard Filters by Property and Status (Priority: P2)

**Goal**: Manager dashboard supports filtering requests by property and/or status, updating results without page reload.

**Independent Test**: Manager with requests across 3 properties — select property "Sunset Apartments" → verify only that property's requests appear; additionally filter by status "OPEN" → verify only open requests for that property are shown.

- [X] T045 [US4] Update `GET /api/requests` in `src/app/api/requests/route.ts` (MANAGER branch) to support `propertyId` and `status` query params: apply `WHERE unit.property.id = propertyId` and/or `WHERE status = status` when params are present; verify manager owns the filtered property (return 403 if not)
- [X] T046 [P] [US4] Create `src/components/requests/RequestFilters.tsx` — client component with two shadcn Select dropdowns: property selector (options from `GET /api/properties`) and status selector (OPEN/IN_PROGRESS/RESOLVED/All); on change, updates URL search params (`?propertyId=&status=`) triggering server-side re-fetch; includes "Clear filters" button
- [X] T047 [P] [US4] Create `src/components/dashboard/DashboardTable.tsx` — renders a shadcn Table with columns: Property, Unit, Title, Status (badge), Vendor, Submitted date; each row links to `(manager)/requests/[id]`; shows empty state when no results match filters; accepts requests array as prop
- [X] T048 [US4] Update `src/app/(manager)/dashboard/page.tsx` to read `propertyId` and `status` from URL `searchParams`, pass them to `GET /api/requests`, render `RequestFilters` (client island) and `DashboardTable` (server-rendered with filtered data); filters preserve state via URL so the page is shareable and browser-back-navigable

**Checkpoint**: Manager dashboard shows filtered results by property and/or status, updating on filter change.

---

## Phase 7: User Story 5 — Subscription Plans Based on Unit Count (Priority: P3)

**Goal**: Managers select a Stripe-powered subscription plan gated by unit count; payment failure triggers a 7-day grace period then read-only restriction.

**Independent Test**: Select "Starter" plan → complete Stripe test checkout → verify account `Subscription.status = ACTIVE` and `unitLimit = 10`; attempt to add an 11th unit → verify 403 with upgrade prompt.

- [X] T049 [US5] Create `src/lib/stripe.ts` — initialize Stripe Node.js client with `STRIPE_SECRET_KEY`; export `stripe` instance; add JSDoc note that webhook handler requires raw body via `req.text()`
- [X] T050 [P] [US5] Implement `GET /api/billing/plans` in `src/app/api/billing/plans/route.ts`: query all SubscriptionPlan records from DB; return array with `id`, `name`, `unitLimit`, `priceMonthly` (in cents), `currency: "usd"`; no auth required (public endpoint)
- [X] T051 [US5] Implement `POST /api/billing/checkout` in `src/app/api/billing/checkout/route.ts`: authenticate MANAGER session; look up SubscriptionPlan by `planId`; create or retrieve Stripe customer using manager's email and `stripeCustomerId` from Subscription record; create Stripe Checkout session with the plan's `stripePriceId`, `mode: "subscription"`, `success_url`, `cancel_url`; return `{ checkoutUrl }`
- [X] T052 [P] [US5] Implement `POST /api/billing/portal` in `src/app/api/billing/portal/route.ts`: authenticate MANAGER session; retrieve `stripeCustomerId` from manager's Subscription; create Stripe Customer Portal session; return `{ portalUrl }`; return 400 if manager has no active subscription
- [X] T053 [US5] Implement `POST /api/webhooks/stripe` in `src/app/api/webhooks/stripe/route.ts`: read raw body via `await req.text()`; verify signature with `stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)`; return 400 on failure; handle events: `checkout.session.completed` → upsert Subscription (status=ACTIVE, store stripeCustomerId/stripeSubscriptionId, set unitLimit from plan); `invoice.payment_succeeded` → set status=ACTIVE, clear gracePeriodEnd, call `notifyBilling(managerId, 'resolved')`; `invoice.payment_failed` → set status=GRACE, set gracePeriodEnd=now+7days, call `notifyBilling(managerId, 'failed', gracePeriodEnd)`; `customer.subscription.deleted` → set status=RESTRICTED; `customer.subscription.updated` → update planId, unitLimit, currentPeriodEnd; return `{ received: true }`
- [X] T054 [US5] Add grace-period expiry enforcement to `src/lib/subscription.ts`: extend `getManagerSubscription` to auto-transition status from GRACE to RESTRICTED if `gracePeriodEnd < new Date()` and persist the change to DB; this ensures RESTRICTED enforcement even if the Stripe webhook for period-end is delayed
- [X] T055 [US5] Integrate subscription enforcement across all write endpoints: update `POST /api/requests`, `PATCH /api/requests/:id`, `POST /api/properties`, `POST /api/properties/:id/units` to call `getManagerSubscription` and return 403 `{ error: "Account restricted. Please resolve billing." }` when status=RESTRICTED; `POST /api/properties/:id/units` additionally returns 403 `{ error: "Unit limit reached. Upgrade your plan." }` when current unit count ≥ unitLimit
- [X] T056 [US5] Create `src/app/(manager)/billing/page.tsx`: if manager has no subscription → fetch plans from `GET /api/billing/plans`, render plan cards with unit limits, prices, and "Subscribe" button (calls `POST /api/billing/checkout` then redirects to `checkoutUrl`); if manager has active subscription → show current plan name, status, next billing date, and "Manage Subscription" button (calls `POST /api/billing/portal` then redirects to `portalUrl`); if status=GRACE → show warning banner with `gracePeriodEnd` countdown; if status=RESTRICTED → show error banner with payment resolution instructions
- [X] T057 [US5] Update `prisma/seed.ts` to replace placeholder `stripePriceId` values with real Stripe test-mode Price IDs (or document the manual step to create prices in the Stripe dashboard and update the DB); add `STRIPE_STARTER_PRICE_ID`, `STRIPE_GROWTH_PRICE_ID`, `STRIPE_PROFESSIONAL_PRICE_ID` to `.env.local`

**Checkpoint**: Managers can subscribe to a plan via Stripe Checkout, view/change their plan via the Customer Portal, and unit count limits are enforced. Payment failure triggers grace period → restriction flow.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Vendor experience, UX polish, error handling, and deployment readiness.

- [X] T058 [P] Create `src/app/(vendor)/layout.tsx` (vendor shell with navigation) and `src/app/(vendor)/requests/page.tsx` — vendor view fetching `GET /api/requests` (vendor branch: requests where `vendorId = session.user.id`); renders list with `RequestStatusBadge`, request title, property name, and unit number
- [X] T059 [P] Add loading skeleton states using shadcn Skeleton component to `DashboardTable.tsx`, tenant request list page, and property list page — show skeleton rows while server components await data
- [X] T060 [P] Create `src/app/error.tsx` (global error boundary) and `src/app/not-found.tsx` (404 page) with user-friendly messages and navigation back to the appropriate role dashboard
- [X] T061 [P] Add inline form validation feedback to `RequestForm.tsx` (required fields, min title length), the login form (invalid credentials message), and the add-property/add-unit forms (required fields, unique unitNumber within property)
- [X] T062 Add `src/app/api/requests/[id]/route.ts` (GET branch) for MANAGER role: return request with full detail including tenant name, vendor name, unit number, property name, and `updatedAt` timestamp for the manager's request detail page
- [X] T063 Validate the complete end-to-end flow against `specs/001-property-mgmt-automation/quickstart.md`: initialize project, run seed, create manager → subscribe to Starter plan → add property → add unit → assign tenant → tenant submits request → manager assigns vendor and updates status → verify email notification received → simulate payment failure via Stripe CLI → verify grace period behavior

## Phase 9: Monetization & Ads (Post-Launch Enhancements)

- [X] T064 [US5] Add `adsEnabled` field to `SubscriptionPlan` model and update Prisma schema
- [X] T065 [US5] Update `prisma/seed.ts` to include "Free" tier (2 units, adsEnabled=true)
- [X] T066 [US5] Update `src/lib/subscription.ts` to handle Free tier defaults and return `adsEnabled` flag
- [X] T067 [US5] Create `src/components/ui/AdBanner.tsx` component for non-intrusive advertising
- [X] T068 [US5] Integrate `AdBanner` into `DashboardPage` and `PropertiesPage` (conditionally show if `adsEnabled`)
- [X] T069 [US5] Update `BillingPage` to display Free tier, ads info, and current plan status
- [X] T070 [US5] Update `POST /api/properties/:id/units` to enforce the new 2-unit limit for the Free tier
