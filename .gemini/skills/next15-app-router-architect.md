# Skill: next15-app-router-architect
## Goal: Maximize performance and stability on Next.js 15.
## Instructions:
- Prioritize **Server Components** for data fetching to keep JS bundles small.
- Use **Server Actions** for all mutations, implementing the `useActionState` hook for form feedback.
- Strictly separate Edge-compatible logic (Middleware/Auth) from Node.js-only logic (Prisma/Bcrypt).
