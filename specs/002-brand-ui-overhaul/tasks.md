# Tasks: Brand Identity and UI/UX Overhaul

**Input**: Design documents from `/specs/002-brand-ui-overhaul/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Configure Tailwind v4 with the new "Proprietary Blue & Gold" Brand Palette in `src/app/globals.css`
- [ ] T002 Create `BrandLogo` component in `src/components/ui/BrandLogo.tsx`
- [ ] T003 [P] Create `ThemeToggle` component in `src/components/ui/ThemeToggle.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T004 Implement `ModernLayout` base component in `src/components/layout/ModernLayout.tsx` (Glassmorphism sidebar/header)
- [ ] T005 [P] Create `GlassCard` component in `src/components/ui/GlassCard.tsx`
- [ ] T006 [P] Update `src/components/ui/button.tsx` to support the new Brand Palette variants

**Checkpoint**: Foundation ready - UI overhaul can now begin across all user stories.

---

## Phase 3: User Story 1 - Unified Brand Identity (Priority: P1) 🎯 MVP

**Goal**: Establish the brand identity on the login and landing sections.

**Independent Test**: Verify the login page features the new logo, colors, and modern layout.

### Implementation for User Story 1

- [ ] T007 [P] [US1] Update `src/app/(auth)/layout.tsx` to use `BrandLogo` and new modern background styles
- [ ] T008 [P] [US1] Refactor `src/app/(auth)/login/page.tsx` with polished form styling and brand colors
- [ ] T009 [US1] Implement a "Welcome" hero section on the login page for a "fancy" first impression

**Checkpoint**: User Story 1 complete - Brand identity is visible and professional.

---

## Phase 4: User Story 2 - Modern Manager Dashboard (Priority: P1)

**Goal**: Overhaul the Manager experience for high-end usability.

**Independent Test**: Navigate through the Manager dashboard and verify all pages use the new `ModernLayout` and `GlassCard`.

### Implementation for User Story 2

- [ ] T010 [P] [US2] Update `src/app/(manager)/layout.tsx` to use the new `ModernLayout`
- [ ] T011 [US2] Refactor `src/app/(manager)/dashboard/page.tsx` to use `GlassCard` for overview statistics
- [ ] T012 [P] [US2] Update `src/components/dashboard/DashboardTable.tsx` with refined typography and hover effects
- [ ] T013 [P] [US2] Update `src/app/(manager)/properties/page.tsx` to a modern card grid layout using `GlassCard`
- [ ] T014 [US2] Refine `src/components/dashboard/CreatePropertyForm.tsx` for a "premium" data entry feel

**Checkpoint**: User Story 2 complete - Manager experience is "fancy" and highly usable.

---

## Phase 5: User Story 3 - Polished Tenant/Vendor Interactions (Priority: P2)

**Goal**: Ensure Tenants and Vendors have a polished, mobile-responsive experience.

**Independent Test**: Submit a request as a Tenant on a mobile viewport and verify ease of use and brand consistency.

### Implementation for User Story 3

- [ ] T015 [P] [US3] Update `src/app/(tenant)/layout.tsx` and `src/app/(vendor)/layout.tsx` to use `ModernLayout`
- [ ] T016 [P] [US3] Refactor `src/components/requests/RequestForm.tsx` with improved spacing and modern input styles
- [ ] T017 [P] [US3] Update `src/components/requests/RequestStatusBadge.tsx` to use the new Brand Palette accents
- [ ] T018 [US3] Update `src/app/(tenant)/requests/page.tsx` with a simplified, mobile-first list view

**Checkpoint**: User Story 3 complete - All user roles have a consistent, high-end experience.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T019 Implement high-quality skeleton loaders for all data-fetching pages in `src/components/ui/skeleton.tsx`
- [ ] T020 Add subtle transition animations for page navigation (using Tailwind transitions)
- [ ] T021 Standardize all `src/components/ui/` components (Input, Select, Badge) for consistent border-radius and focus states
- [ ] T022 Run `quickstart.md` validation and perform final visual audit in light and dark modes

---

## Dependencies & Execution Order

1. **Setup (Phase 1)** must be completed first.
2. **Foundational (Phase 2)** blocks all User Stories.
3. **User Story 1 (P1)** is the MVP focus.
4. **User Story 2 (P1)** and **User Story 3 (P2)** can proceed after the foundation is ready.
5. **Polish (Phase 6)** is the final step for "unforgettable" quality.
