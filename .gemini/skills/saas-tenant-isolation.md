# Skill: saas-tenant-isolation
## Goal: Ensure 100% data silo integrity.
## Instructions:
- Every Prisma query MUST include a `where` clause filtering by `managerId` or `tenantId` derived from the session. 
- Never trust a `propertyId` or `unitId` from a request body without verifying ownership via a join or existence check in the same query.
- Use Middleware to intercept and block cross-tenant ID access at the routing level.
