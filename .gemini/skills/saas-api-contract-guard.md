# Skill: saas-api-contract-guard
## Goal: Zero-breakage API updates.
## Instructions:
- Always check `specs/contracts/api-contracts.md` before modifying a route.
- Use **Zod** for strict input validation on all POST/PATCH requests.
- Return consistent error shapes: `{ error: string, code: string, details?: any }`.
