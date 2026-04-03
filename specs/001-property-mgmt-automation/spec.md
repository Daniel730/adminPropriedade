# Feature Specification: Property Management Automation

**Feature Branch**: `001-property-mgmt-automation`  
**Created**: 2026-04-02  
**Status**: Draft  
**Input**: User description: "Build a property management automation app. Tenants submit maintence requests. Managers assign vendors and change status. Send notifications on status change. Dashboard filters by property and status. Add Stripe plans based on Unit count"

## Clarifications

### Session 2026-04-02

- Q: When a payment fails and the account is restricted, what level of access remains? → A: 7-day grace period with full access, then read-only until payment is resolved.
- Q: Is "Account Owner" a distinct role from "Manager"? → A: Same role — Manager handles both property operations and billing/subscriptions.
- Q: Can a manager revert a maintenance request status? → A: Re-open only — Resolved → Open is permitted; no other backward transitions allowed.
- Q: How should duplicate maintenance requests be handled? → A: Allow all submissions; manager identifies and merges duplicates manually.
- Q: Can a tenant see other tenants' requests in the same property? → A: No — tenants only see their own requests (strict data isolation by tenant).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Tenant Submits Maintenance Request (Priority: P1)

A tenant logs into the app and submits a maintenance request describing an issue in their unit (e.g., broken heater, leaking pipe). They receive a confirmation and can track the status of their request.

**Why this priority**: The core value of the system is enabling tenants to report issues digitally. Without this, no other workflow can begin.

**Independent Test**: Can be fully tested by a tenant submitting a request and verifying it appears in the manager's dashboard, delivering the core issue-reporting value.

**Acceptance Scenarios**:

1. **Given** a logged-in tenant, **When** they fill in and submit a maintenance request with a title, description, and unit info, **Then** the request is saved and the tenant sees a confirmation with a tracking reference.
2. **Given** a submitted request, **When** the tenant views their requests list, **Then** they see the current status (e.g., Open, In Progress, Resolved).
3. **Given** a tenant not logged in, **When** they attempt to submit a request, **Then** they are redirected to the login page.

---

### User Story 2 - Manager Assigns Vendor and Updates Status (Priority: P1)

A property manager views all open maintenance requests for their properties, assigns a vendor to a request, and updates the request status as work progresses (Open → In Progress → Resolved). A manager may also re-open a Resolved request (Resolved → Open) if the issue recurs.

**Why this priority**: Managers must be able to act on requests for the system to deliver operational value. This is co-equal in priority with request submission.

**Independent Test**: Can be tested by a manager logging in, viewing an existing request, assigning a vendor, and changing the status — verifying the status update is persisted.

**Acceptance Scenarios**:

1. **Given** a manager viewing a maintenance request, **When** they assign a vendor from a list and save, **Then** the vendor is associated with the request and the assignment is recorded.
2. **Given** a manager on a request detail page, **When** they change the status (e.g., from Open to In Progress), **Then** the status updates and a notification is triggered.
3. **Given** a manager, **When** they view the dashboard, **Then** they only see requests belonging to properties they manage.

---

### User Story 3 - Notifications on Status Change (Priority: P2)

When a maintenance request status changes, the relevant parties (tenant, manager, assigned vendor) automatically receive a notification informing them of the update.

**Why this priority**: Notifications reduce manual communication overhead and keep all parties aligned. Important, but the system still delivers value without them.

**Independent Test**: Can be tested by changing a request status and verifying that the affected tenant receives a notification (email or in-app) reflecting the new status.

**Acceptance Scenarios**:

1. **Given** a request status changes to "In Progress", **When** the change is saved, **Then** the tenant receives a notification with the request title and new status.
2. **Given** a request status changes to "Resolved", **When** the change is saved, **Then** the tenant and manager both receive a resolution notification.
3. **Given** a vendor is assigned to a request, **When** the assignment is saved, **Then** the vendor receives a notification with the request details.

---

### User Story 4 - Dashboard with Filters by Property and Status (Priority: P2)

A manager uses the dashboard to view and filter maintenance requests by property and/or status, enabling quick triage and workload management.

**Why this priority**: Filtering is a productivity multiplier for managers with multiple properties. The system works without it but becomes harder to use at scale.

**Independent Test**: Can be tested by a manager with requests across multiple properties applying filters and verifying only matching requests are displayed.

**Acceptance Scenarios**:

1. **Given** a manager on the dashboard, **When** they filter by a specific property, **Then** only requests for that property are shown.
2. **Given** a manager on the dashboard, **When** they filter by status "Open", **Then** only open requests are displayed.
3. **Given** a manager on the dashboard, **When** they combine property and status filters, **Then** only requests matching both criteria are shown.
4. **Given** no filters applied, **When** the manager views the dashboard, **Then** all requests across their properties are shown with property and status labels.

---

### User Story 5 - Subscription Plans Based on Unit Count (Priority: P3)

A manager selects a subscription plan priced according to the number of units they manage. 
The system offers a "Free" tier for small-scale use (up to 2 units) which includes non-intrusive advertisements. 
Paid plans remove advertisements and offer higher unit limits.
Billing is handled automatically for paid plans, and the account is gated to the unit count of their plan. The manager is also responsible for billing and subscription management.

**Why this priority**: Monetization is critical for business sustainability but does not affect core operational workflows for existing users.

**Independent Test**: Can be tested by selecting a plan, completing checkout, and verifying the account's unit limit reflects the selected plan. For the free tier, verify ads are visible.

**Acceptance Scenarios**:

1. **Given** a new account, **When** the manager uses the system without a paid plan, **Then** they are on the "Free" tier (up to 2 units) and see non-intrusive ads in the dashboard.
2. **Given** a manager selects a paid plan (e.g., Starter: up to 10 units), **When** they complete checkout, **Then** their account is activated with that unit limit and ads are removed.
3. **Given** an active subscription, **When** the manager attempts to add more units than their plan allows, **Then** they are prompted to upgrade their plan.
4. **Given** a successful payment, **When** the subscription period renews, **Then** the account remains active and the manager receives a billing confirmation.
5. **Given** a failed payment, **When** the renewal is attempted, **Then** the manager is notified and the account enters a 7-day grace period with full access; after the grace period the account becomes read-only until payment is resolved.
6. **Given** a Free tier account, **When** the manager adds 2 units, **Then** they cannot add a 3rd unit without upgrading to a paid plan.

---

### Edge Cases

- Duplicate requests: all submissions are accepted regardless of existing open requests for the same unit; the manager is responsible for identifying and consolidating duplicates.
- How does the system handle a vendor being removed while assigned to an open request?
- What happens if a manager changes status while another manager is simultaneously editing the same request?
- How are notifications handled if a tenant's contact information is missing or invalid?
- On payment failure: a 7-day grace period grants full access; after grace period the account becomes read-only (no new submissions or status changes) until payment is resolved.
- How does the system handle a property being deleted when it has open maintenance requests?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Tenants MUST be able to submit maintenance requests including a title, description, and their unit/property information. Multiple open requests per unit are permitted; duplicate identification is the manager's responsibility.
- **FR-002**: Tenants MUST be able to view the current status of all their submitted maintenance requests.
- **FR-003**: Managers MUST be able to view all maintenance requests for properties they manage.
- **FR-004**: Managers MUST be able to assign a vendor to any maintenance request.
- **FR-005**: Managers MUST be able to change the status of a maintenance request following allowed transitions: Open → In Progress → Resolved, and Resolved → Open (re-open). No other backward transitions are permitted.
- **FR-006**: System MUST send notifications to the tenant when a request status changes.
- **FR-007**: System MUST send a notification to a vendor when they are assigned to a maintenance request.
- **FR-008**: System MUST send a notification to the manager when a request they manage is resolved.
- **FR-009**: The manager dashboard MUST support filtering requests by property.
- **FR-010**: The manager dashboard MUST support filtering requests by status.
- **FR-011**: The manager dashboard MUST support combining property and status filters simultaneously.
- **FR-012**: System MUST support multiple subscription plans differentiated by the maximum number of manageable units, including a "Free" tier.
- **FR-013**: System MUST enforce unit count limits based on the active subscription plan.
- **FR-014**: System MUST provide a checkout flow for selecting and paying for a subscription plan, and a way to choose the Free tier.
- **FR-015**: System MUST handle recurring billing and notify managers of successful and failed payments for paid plans.
- **FR-015a**: On payment failure, system MUST allow full access for a 7-day grace period, then restrict the account to read-only mode until payment is resolved.
- **FR-016**: System MUST restrict or prompt upgrade when a manager attempts to exceed their plan's unit limit.
- **FR-017**: System MUST support role-based access: tenants, managers, and vendors have distinct permissions.
- **FR-018**: Tenants MUST only be able to view their own maintenance requests; requests submitted by other tenants in the same property MUST NOT be visible to them.
- **FR-019**: System MUST display non-intrusive advertisements for accounts on the "Free" tier.
- **FR-020**: System MUST NOT display advertisements for accounts on any paid subscription plan.


### Key Entities

- **MaintenanceRequest**: A reported issue from a tenant. Attributes: title, description, status (Open/In Progress/Resolved), submission date, associated unit, assigned vendor, submitting tenant. Allowed status transitions: Open → In Progress → Resolved, and Resolved → Open (re-open only).
- **Property**: A building or address managed by one or more managers. Contains multiple units.
- **Unit**: An individual rentable space within a property, linked to a tenant.
- **Tenant**: A user who occupies a unit and can submit maintenance requests. Tenants can only view their own requests; other tenants' requests are not accessible.
- **Manager**: A user who manages one or more properties and oversees maintenance requests.
- **Vendor**: A service provider (contractor, plumber, etc.) who can be assigned to maintenance requests by a manager.
- **Notification**: A message sent to a user on a relevant event (status change, assignment). Delivered via email by default.
- **SubscriptionPlan**: Defines a unit count tier, billing amount, and whether ads are enabled. Examples: Free (up to 2 units, with ads), Starter (up to 10 units, no ads), Growth (up to 50 units, no ads), Professional (up to 200 units, no ads).
- **Subscription**: The active plan for an account, linked to billing status and unit limit enforcement.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Tenants can submit a maintenance request in under 2 minutes from login to confirmation.
- **SC-002**: Managers can assign a vendor and update a request status in under 60 seconds.
- **SC-003**: Notifications reach recipients within 2 minutes of a status change event.
- **SC-004**: Dashboard filter results update within 3 seconds after a filter is applied.
- **SC-005**: 90% of tenants can successfully submit their first maintenance request without external help.
- **SC-006**: Managers can complete plan selection and checkout in under 5 minutes.
- **SC-007**: System correctly enforces unit limits for 100% of accounts at plan boundaries.
- **SC-008**: Billing renewal succeeds or fails gracefully with appropriate manager notification in 100% of cases.

## Assumptions

- Each unit is occupied by one primary tenant account; multiple tenants per unit is out of scope for v1.
- Vendors are pre-registered in the system by a manager; vendor self-registration is out of scope for v1.
- Notifications are delivered primarily via email; in-app notification bells are a secondary enhancement.
- A manager may manage multiple properties; a property belongs to one account/organization.
- Subscription plans are billed monthly; annual billing is out of scope for v1.
- Three subscription tiers (Starter, Growth, Professional) cover the majority of use cases; custom enterprise pricing is out of scope for v1.
- Managers manually add and assign units to properties; tenant-to-unit assignment is managed by the manager.
- The app is web-based; native mobile apps are out of scope for v1.
- Authentication uses standard email/password with session management; SSO/OAuth is out of scope for v1.
- Photo or file attachments on maintenance requests are desirable but not required for v1.
