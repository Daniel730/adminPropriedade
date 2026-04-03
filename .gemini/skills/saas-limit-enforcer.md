# Skill: saas-limit-enforcer
## Goal: Enforce Tier-based usage limits (Units, Requests, Users).
## Instructions:
- Create a `checkLimit(managerId, resourceType)` utility.
- Inject limit checks into **Server Actions** before executing Prisma `create` calls.
- Provide a "Limit Reached" error type for the frontend to catch.
