# Skill: saas-rbac-specialist
## Goal: Granular permission management for Manager, Tenant, and Vendor roles.
## Instructions:
- Implement a `can(user, action, resource)` pattern.
- Use Next.js 15 `use cache` and `revalidateTag` to ensure permissions updates are reflected across the App Router instantly.
- Ensure Vendors can only see requests specifically assigned to them, never the full property unit list.
