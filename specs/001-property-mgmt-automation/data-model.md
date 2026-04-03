# Data Model: Property Management Automation

**Branch**: `001-property-mgmt-automation` | **Date**: 2026-04-02

---

## Entity Relationship Overview

```
SubscriptionPlan (seed data)
    └── Subscription (1:1 per Manager account)

User (role: TENANT | MANAGER | VENDOR)
    ├── Property (1:N — Manager owns many Properties)
    │     └── Unit (1:N — Property has many Units)
    │           └── Tenant assignment (0..1 User per Unit)
    └── MaintenanceRequest (1:N — Tenant submits many Requests)
          ├── Vendor assignment (0..1 User with role=VENDOR)
          └── Notification (1:N — Request triggers Notifications)
```

---

## Entities

### User

Shared user table for all roles. Role determines access permissions.

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| email | String (unique) | Login identifier |
| password_hash | String | Bcrypt hash; nullable for future OAuth |
| name | String | Display name |
| role | Enum: TENANT \| MANAGER \| VENDOR | Determines access rights |
| created_at | DateTime | Record creation timestamp |
| updated_at | DateTime | Auto-updated on change |

**Constraints**:
- `email` must be unique across all users regardless of role
- `role` is set at registration and can only be changed by system admin

---

### Property

A building or address managed by a Manager.

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | String | Human-readable property name |
| address | String | Full address string |
| manager_id | UUID (FK → User) | The Manager who owns this property |
| created_at | DateTime | |
| updated_at | DateTime | |

**Constraints**:
- `manager_id` must reference a User with `role = MANAGER`
- A Manager can own many Properties
- Deleting a Property is blocked if it has Units with open MaintenanceRequests

---

### Unit

An individual rentable space within a Property.

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| property_id | UUID (FK → Property) | Parent property |
| unit_number | String | e.g., "101", "A2", "Ground Floor" |
| tenant_id | UUID (FK → User) \| null | Assigned tenant; nullable if vacant |
| created_at | DateTime | |
| updated_at | DateTime | |

**Constraints**:
- `unit_number` is unique within a `property_id`
- `tenant_id` must reference a User with `role = TENANT` if set
- Total unit count across all Properties owned by a Manager must not exceed the Manager's active subscription `unit_limit`

---

### MaintenanceRequest

A reported maintenance issue submitted by a Tenant.

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| title | String | Short summary of the issue |
| description | String | Detailed description |
| status | Enum: OPEN \| IN_PROGRESS \| RESOLVED | Current state |
| unit_id | UUID (FK → Unit) | The unit the issue relates to |
| tenant_id | UUID (FK → User) | The Tenant who submitted |
| vendor_id | UUID (FK → User) \| null | Assigned vendor; nullable until assigned |
| created_at | DateTime | Submission timestamp |
| updated_at | DateTime | Auto-updated on status/vendor change |

**State Transition Rules** (enforced server-side):
```
Allowed transitions:
  OPEN        → IN_PROGRESS
  IN_PROGRESS → RESOLVED
  RESOLVED    → OPEN        (re-open only)

Disallowed (rejected with error):
  OPEN        → RESOLVED    (must pass through IN_PROGRESS)
  IN_PROGRESS → OPEN
  RESOLVED    → IN_PROGRESS
```

**Constraints**:
- `tenant_id` must match the `tenant_id` of the referenced Unit
- `vendor_id` must reference a User with `role = VENDOR` if set
- Multiple open requests per Unit are permitted (no uniqueness constraint)
- Status transitions outside allowed rules return a validation error

---

### Notification

An event-driven message sent to a User.

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| user_id | UUID (FK → User) | Recipient |
| request_id | UUID (FK → MaintenanceRequest) \| null | Associated request |
| type | Enum: STATUS_CHANGE \| VENDOR_ASSIGNED \| BILLING | Notification category |
| message | String | Human-readable notification body |
| read | Boolean | Default: false |
| created_at | DateTime | |

**Notification trigger rules**:

| Event | Recipients |
|---|---|
| Status → IN_PROGRESS | Tenant |
| Status → RESOLVED | Tenant + Manager |
| Status → OPEN (re-open) | Manager |
| Vendor assigned | Vendor |
| Payment failed | Manager (type: BILLING) |
| Payment resolved | Manager (type: BILLING) |

---

### SubscriptionPlan

Seed data defining available tiers. Not user-editable.

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| name | String | e.g., "Free", "Starter", "Growth", "Professional" |
| unit_limit | Integer | Max units allowed on this plan |
| price_monthly_cents | Integer | Price in cents (e.g., 2900 = $29.00) |
| stripe_price_id | String \| null | Stripe Price ID for checkout; null for Free tier |
| ads_enabled | Boolean | Whether to show advertisements (Default: false) |

**Initial tiers**:

| Name | Unit Limit | Monthly Price | Ads Enabled |
|---|---|---|---|
| Free | 2 | $0/month | Yes |
| Starter | 10 | $29/month | No |
| Growth | 50 | $79/month | No |
| Professional | 200 | $149/month | No |

---

### Subscription

The active billing relationship for a Manager account.

| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| manager_id | UUID (FK → User, unique) | One subscription per Manager |
| plan_id | UUID (FK → SubscriptionPlan) | Current plan |
| unit_limit | Integer | Denormalized from plan for fast enforcement |
| stripe_customer_id | String | Stripe Customer ID |
| stripe_subscription_id | String | Stripe Subscription ID |
| status | Enum: ACTIVE \| GRACE \| RESTRICTED | Billing state |
| current_period_end | DateTime | When current billing period ends |
| grace_period_end | DateTime \| null | Set on payment failure; 7 days from failure |
| created_at | DateTime | |
| updated_at | DateTime | |

**Status transition rules** (driven by Stripe webhooks):

```
ACTIVE      → GRACE       (invoice.payment_failed)
GRACE       → ACTIVE      (invoice.payment_succeeded)
GRACE       → RESTRICTED  (grace_period_end passed with no payment)
RESTRICTED  → ACTIVE      (invoice.payment_succeeded)
```

**Read-only mode** (status = RESTRICTED):
- Tenants cannot submit new MaintenanceRequests
- Managers cannot change request status or assign vendors
- Managers cannot add new Units or Properties
- All read operations (view requests, dashboard) remain accessible

---

## Prisma Schema (reference)

```prisma
enum Role {
  TENANT
  MANAGER
  VENDOR
}

enum RequestStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
}

enum SubscriptionStatus {
  ACTIVE
  GRACE
  RESTRICTED
}

enum NotificationType {
  STATUS_CHANGE
  VENDOR_ASSIGNED
  BILLING
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  name          String
  role          Role
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  properties         Property[]
  subscription       Subscription?
  submittedRequests  MaintenanceRequest[] @relation("TenantRequests")
  assignedRequests   MaintenanceRequest[] @relation("VendorRequests")
  notifications      Notification[]
  occupiedUnit       Unit?
}

model Property {
  id         String   @id @default(uuid())
  name       String
  address    String
  managerId  String
  manager    User     @relation(fields: [managerId], references: [id])
  units      Unit[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Unit {
  id           String    @id @default(uuid())
  propertyId   String
  property     Property  @relation(fields: [propertyId], references: [id])
  unitNumber   String
  tenantId     String?   @unique
  tenant       User?     @relation(fields: [tenantId], references: [id])
  requests     MaintenanceRequest[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@unique([propertyId, unitNumber])
}

model MaintenanceRequest {
  id            String         @id @default(uuid())
  title         String
  description   String
  status        RequestStatus  @default(OPEN)
  unitId        String
  unit          Unit           @relation(fields: [unitId], references: [id])
  tenantId      String
  tenant        User           @relation("TenantRequests", fields: [tenantId], references: [id])
  vendorId      String?
  vendor        User?          @relation("VendorRequests", fields: [vendorId], references: [id])
  notifications Notification[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Notification {
  id        String           @id @default(uuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id])
  requestId String?
  request   MaintenanceRequest? @relation(fields: [requestId], references: [id])
  type      NotificationType
  message   String
  read      Boolean          @default(false)
  createdAt DateTime         @default(now())
}

model SubscriptionPlan {
  id                  String         @id @default(uuid())
  name                String         @unique
  unitLimit           Int
  priceMonthlyCents   Int
  stripePriceId       String?        @unique
  adsEnabled          Boolean        @default(false)
  subscriptions       Subscription[]
}

model Subscription {
  id                   String             @id @default(uuid())
  managerId            String             @unique
  manager              User               @relation(fields: [managerId], references: [id])
  planId               String
  plan                 SubscriptionPlan   @relation(fields: [planId], references: [id])
  unitLimit            Int
  stripeCustomerId     String             @unique
  stripeSubscriptionId String             @unique
  status               SubscriptionStatus @default(ACTIVE)
  currentPeriodEnd     DateTime
  gracePeriodEnd       DateTime?
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt
}
```
