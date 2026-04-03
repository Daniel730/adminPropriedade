# Skill: Project Wisdom

**Description**: Captures and evolves project-specific engineering patterns, architectural decisions, and lessons learned. Trigger this skill at the end of every session to update the project's knowledge base.

## Workflow: End-of-Session Retrospective

1. **Review**: Analyze the session's work (Git diffs, file changes, history).
2. **Document**: Update the "Living Wisdom" section below with new patterns, components, or decisions.
3. **Log**: Record the session summary in the "Session Log" section.

---

## Living Wisdom: Patterns & Standards

### Core Stack
- **Next.js 15 (App Router)**
- **Auth.js v5** (NextAuth)
- **Prisma + SQLite** (Dev)
- **shadcn/ui** + **Vanilla CSS**
- **Vitest** for Unit/Integration testing

### Established Patterns
- **Modern Layout**: Use `src/components/layout/ModernLayout.tsx` for role-based navigation.
- **Glass UI**: Use `src/components/ui/GlassCard.tsx` for modern containers.
- **Sign-In/Out**: Server Actions in `src/app/(auth)/login/page.tsx` and `src/components/layout/ModernLayout.tsx` (using `signOut` from `@/lib/auth`).
- **Data Access**: Prisma singleton in `src/lib/prisma.ts`.
- **Tenant Management**: Units are managed via `ManageUnitModal` within the Property detail page (`PATCH /api/units/:id`).
- **Testing**: Vitest with `jsdom` environment. Configured in `vitest.config.ts`.

### Project "Gotchas"
- **Auth.js Redirection**: Explicitly pass `redirectTo` in `signIn` and `signOut` to avoid default navigation issues.
- **Client/Server Components**: Use `Serialized` data types when passing Prisma results to complex Client Components.

---

## Session Log

### [2026-04-02] - Session 1
- **Achievements**: Initial project walkthrough; Created `project-wisdom` skill.
- **Decisions**: Established this living document as the agent's memory.

### [2026-04-02] - Session 2
- **Achievements**: 
  - Installed and configured **Vitest** for TDD.
  - Fixed **Auth flows** (login/logout redirection).
  - Implemented **Tenant Request Detail page**.
  - Built **Manage Unit modal** for tenant assignment.
  - Fixed **Billing & Customer Portal** flow.
  - Seeded database with Property/Unit assignments for Dummy Tenant.
- **Decisions**: 
  - Standardized on modal-based management for Unit-Tenant assignments.
  - Mandated server-action based Auth triggers in UI.
- **Next Steps**: 
  - Verify Vendor dashboard and request management.
  - Implement E2E tests for the happy path (Tenant submit -> Manager assign -> Vendor resolve).
