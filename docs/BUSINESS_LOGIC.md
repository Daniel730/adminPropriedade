# Business Logic & Rules Documentation

This document serves as the "Source of Truth" for the application rules and relationship models within PropFlow.

---

## 1. Authentication & Role Definitions

PropFlow uses a strictly tiered role system:

| Role | Access Level | Primary Goals |
| :--- | :--- | :--- |
| **MANAGER** | Full Control | Portfolio management, financial oversight, vendor coordination. |
| **VENDOR** | Operational | Task completion, status updates, earning management. |
| **TENANT** | Residential | Maintenance reporting, receiving announcements. |

### Auth Bypass (Dev Only)
In development, `NEXT_PUBLIC_AUTH_BYPASS` allows instantaneous role swapping without needing to seed users. It generates a mock JWT session that bypasses standard NextAuth providers.

---

## 2. Maintenance Lifecycle

The Maintenance Request is the core atomic unit of PropFlow.

### Transition Rules
Defined in `src/lib/request-transitions.ts`:
1.  **OPEN** -> **IN_PROGRESS**: Occurs when a Manager assigns a Vendor.
2.  **IN_PROGRESS** -> **RESOLVED**: Occurs when a Manager marks the job as finished and provides a cost/rating.
3.  **RESOLVED** -> **OPEN**: A Manager can "Re-open" a rejected or failed repair.

### ⏱️ The 48-Hour SLA
- **Rule**: Every request should be addressed within 48 hours.
- **Implementation**: The standard `DashboardTable.tsx` calculates `createdAt + 48hrs`. If `now` exceeds this and status is not `RESOLVED`, an "AlertOctagon" icon is displayed.
- **Reporting**: Managers can filter by "SLA Breached" to prioritize urgent repairs.

---

## 3. Manager-Vendor Relationship

Vendors are localized to a Manager's account.

- **Invite Model**: Managers "invite" vendors via the `/vendors/new` page.
- **Ownership**: A vendor is linked to a Manager via `vendorManagerId`.
- **Visibility**: A vendor can ONLY see requests assigned to them by their specific manager. They cannot browse a global marketplace of jobs.
- **Performance**: Average ratings are calculated dynamically from `MaintenanceRequest.vendorRating` values across all resolved jobs for that specific vendor.

---

## 4. Tenant-Property Relationship

Tenants have a 1:1 relationship with a `Unit`.

- **Onboarding**: Managers create a `Property`, then `Units`, then assign a `User` (TENANT) to that `Unit`.
- **Property Hub**: Tenants see details ONLY for the property where their unit exists. This includes Announcements created by their Property Manager.
- **Requests**: When a tenant submits a request, it is automatically tagged with their `unitId` and `propertyId`.

---

## 5. Billing & Subscription Logic

The platform operates on a "Manager-Pays" model.

- **Check Logic**: Before creating a Property or Unit, `isAccountRestricted(managerId)` is called.
- **States**:
    - `ACTIVE`: Access to all features.
    - `RESTRICTED`: Happens if Stripe payment fails or subscription is cancelled. Prevents new resource creation but allows existing management.
- **Webhooks**: Stripe webhooks update the `SubscriptionStatus` on the `User` model asynchronously.

---

## 6. AI-Specific Notes

- **API Security**: Every `PATCH` or `POST` route in `/api` MUST verify ownership. (e.g., Do not allow a Manager to update a request belonging to a property they don't own).
- **Glassmorphism UI**: All new components should use `GlassCard.tsx` and the `primary`/`secondary` color tokens to maintain the premium aesthetic.
