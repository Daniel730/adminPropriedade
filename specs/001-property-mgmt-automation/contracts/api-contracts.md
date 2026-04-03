# API Contracts: Property Management Automation

**Branch**: `001-property-mgmt-automation` | **Date**: 2026-04-02  
**Style**: REST over HTTP (Next.js Route Handlers)  
**Base path**: `/api`  
**Auth**: Session cookie (Auth.js v5). All endpoints require authentication unless noted.  
**Role abbreviations**: T = Tenant, M = Manager, V = Vendor

---

## Auth

### POST /api/auth/signin
Sign in with email and password.

**Access**: Public

**Request body**:
```json
{ "email": "user@example.com", "password": "secret" }
```

**Response 200**: Session cookie set. Redirects to role-appropriate dashboard.

**Response 401**: `{ "error": "Invalid credentials" }`

---

### POST /api/auth/signout
Sign out and clear session.

**Access**: Authenticated

**Response 200**: Session cleared.

---

## Maintenance Requests

### POST /api/requests
Tenant submits a new maintenance request.

**Access**: T only. Blocked if account is RESTRICTED.

**Request body**:
```json
{
  "title": "Broken heater",
  "description": "The heater in the bedroom stopped working on Monday.",
  "unitId": "uuid"
}
```

**Validation**:
- `unitId` must belong to a unit assigned to the requesting tenant
- Account subscription status must not be RESTRICTED

**Response 201**:
```json
{
  "id": "uuid",
  "title": "Broken heater",
  "status": "OPEN",
  "createdAt": "2026-04-02T10:00:00Z"
}
```

**Response 403**: `{ "error": "Account restricted. Please resolve billing." }`

**Response 422**: `{ "error": "Unit does not belong to tenant." }`

---

### GET /api/requests
List maintenance requests. Returns different data based on role.

**Access**: T, M, V

**Query params**:
- `propertyId` (M only): filter by property UUID
- `status`: filter by `OPEN | IN_PROGRESS | RESOLVED`
- `page`: integer, default 1
- `limit`: integer, default 20, max 100

**Behaviour by role**:
- **Tenant**: returns only requests where `tenant_id = current user`
- **Manager**: returns requests for all properties owned by the manager
- **Vendor**: returns requests assigned to the current vendor

**Response 200**:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Broken heater",
      "status": "OPEN",
      "unit": { "id": "uuid", "unitNumber": "101" },
      "property": { "id": "uuid", "name": "Sunset Apartments" },
      "vendor": null,
      "createdAt": "2026-04-02T10:00:00Z",
      "updatedAt": "2026-04-02T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 45 }
}
```

---

### GET /api/requests/:id
Get a single maintenance request.

**Access**: T (own requests only), M (own properties only), V (assigned only)

**Response 200**: Full request object including unit, property, tenant name, vendor name, status history (via `updatedAt`).

**Response 403**: `{ "error": "Access denied." }`

**Response 404**: `{ "error": "Request not found." }`

---

### PATCH /api/requests/:id
Manager updates the status and/or assigns a vendor.

**Access**: M only. Blocked if account is RESTRICTED.

**Request body** (all fields optional):
```json
{
  "status": "IN_PROGRESS",
  "vendorId": "uuid"
}
```

**Validation — status transitions**:

| From | To | Allowed |
|---|---|---|
| OPEN | IN_PROGRESS | Yes |
| IN_PROGRESS | RESOLVED | Yes |
| RESOLVED | OPEN | Yes (re-open) |
| Any other combination | | No → 422 |

**Side effects**:
- Status change → trigger notifications per notification rules
- Vendor assignment → trigger vendor notification

**Response 200**: Updated request object.

**Response 403**: `{ "error": "Account restricted." }` or `{ "error": "Access denied." }`

**Response 422**: `{ "error": "Invalid status transition from IN_PROGRESS to OPEN." }`

---

## Properties

### GET /api/properties
List all properties owned by the authenticated Manager.

**Access**: M only

**Response 200**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Sunset Apartments",
      "address": "123 Main St",
      "unitCount": 12,
      "openRequestCount": 3
    }
  ]
}
```

---

### POST /api/properties
Manager creates a new property.

**Access**: M only. Blocked if account is RESTRICTED.

**Request body**:
```json
{ "name": "Sunset Apartments", "address": "123 Main St, City, State 00000" }
```

**Response 201**: Created property object.

---

### GET /api/properties/:id/units
List all units for a property.

**Access**: M (own properties only)

**Response 200**:
```json
{
  "data": [
    {
      "id": "uuid",
      "unitNumber": "101",
      "tenant": { "id": "uuid", "name": "Jane Doe", "email": "jane@example.com" },
      "openRequestCount": 1
    }
  ]
}
```

---

## Units

### POST /api/properties/:id/units
Manager adds a unit to a property.

**Access**: M only. Blocked if account is RESTRICTED or unit count would exceed plan limit.

**Request body**:
```json
{ "unitNumber": "102" }
```

**Response 201**: Created unit object.

**Response 403**: `{ "error": "Unit limit reached. Upgrade your plan." }`

---

### PATCH /api/units/:id
Manager assigns or removes a tenant from a unit.

**Access**: M only

**Request body**:
```json
{ "tenantId": "uuid" }
```
Set `tenantId` to `null` to remove the current tenant.

**Response 200**: Updated unit object.

---

## Vendors

### GET /api/vendors
List all vendors registered under the authenticated Manager's account.

**Access**: M only

**Response 200**:
```json
{
  "data": [
    { "id": "uuid", "name": "Bob's Plumbing", "email": "bob@plumbing.com" }
  ]
}
```

---

### POST /api/vendors
Manager registers a new vendor.

**Access**: M only

**Request body**:
```json
{ "name": "Bob's Plumbing", "email": "bob@plumbing.com", "password": "tempPassword123" }
```

**Response 201**: Created vendor user object (without password).

---

## Billing & Subscriptions

### GET /api/billing/plans
List all available subscription plans.

**Access**: Public (no auth required)

**Response 200**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Starter",
      "unitLimit": 10,
      "priceMonthly": 2900,
      "currency": "usd"
    },
    {
      "id": "uuid",
      "name": "Growth",
      "unitLimit": 50,
      "priceMonthly": 7900,
      "currency": "usd"
    },
    {
      "id": "uuid",
      "name": "Professional",
      "unitLimit": 200,
      "priceMonthly": 14900,
      "currency": "usd"
    }
  ]
}
```

---

### POST /api/billing/checkout
Create a Stripe Checkout session for a plan.

**Access**: M only (must not have an active subscription)

**Request body**:
```json
{ "planId": "uuid" }
```

**Response 200**:
```json
{ "checkoutUrl": "https://checkout.stripe.com/..." }
```

---

### POST /api/billing/portal
Create a Stripe Customer Portal session for managing/upgrading the subscription.

**Access**: M only (must have an active subscription)

**Response 200**:
```json
{ "portalUrl": "https://billing.stripe.com/..." }
```

---

### POST /api/webhooks/stripe
Stripe webhook handler. Processes billing events.

**Access**: Public (verified via Stripe-Signature header)

**Handled events**:

| Event | Action |
|---|---|
| `checkout.session.completed` | Activate subscription, set `status = ACTIVE`, store `stripe_customer_id` and `stripe_subscription_id` |
| `invoice.payment_succeeded` | Set `status = ACTIVE`, clear `grace_period_end`, send confirmation notification |
| `invoice.payment_failed` | Set `status = GRACE`, set `grace_period_end = now + 7 days`, send warning notification |
| `customer.subscription.updated` | Update `plan_id`, `unit_limit`, `current_period_end` |
| `customer.subscription.deleted` | Set `status = RESTRICTED` |

**Response 200**: `{ "received": true }`

**Response 400**: Signature verification failure.

---

## Notifications

### GET /api/notifications
Get the current user's notifications (most recent first).

**Access**: T, M, V

**Query params**:
- `unread`: boolean, filter to unread only
- `limit`: integer, default 20

**Response 200**:
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "STATUS_CHANGE",
      "message": "Your request 'Broken heater' is now In Progress.",
      "read": false,
      "createdAt": "2026-04-02T11:00:00Z",
      "requestId": "uuid"
    }
  ],
  "unreadCount": 3
}
```

---

### PATCH /api/notifications/:id/read
Mark a notification as read.

**Access**: Owner only

**Response 200**: `{ "read": true }`

---

## Error Response Format

All errors follow this structure:

```json
{
  "error": "Human-readable error message",
  "code": "MACHINE_READABLE_CODE"
}
```

**Common HTTP status codes**:

| Code | Meaning |
|---|---|
| 400 | Malformed request body |
| 401 | Not authenticated |
| 403 | Authenticated but not authorized (wrong role or account restricted) |
| 404 | Resource not found |
| 422 | Validation error (e.g., invalid status transition) |
| 500 | Internal server error |
