# Implementation Plan: Brand Identity and UI/UX Overhaul

**Feature**: Brand Identity and UI/UX Overhaul  
**Feature Branch**: `002-brand-ui-overhaul`  
**Status**: Ready for Tasks  

## Strategy Summary

Transform the existing "default" UI into a premium, "unforgettable" experience by defining a unique brand identity ("Proprietary Blue & Gold") and applying modern UI patterns (glassmorphism, larger radii, refined spacing) across all core user journeys.

### Key Focus Areas:
1. **Brand System**: Inject a custom color palette into CSS variables.
2. **Layout Overhaul**: Replace standard layouts with high-end responsive wrappers.
3. **Component Refinement**: Style existing shadcn components to match the new brand.
4. **Experience Polish**: Add micro-interactions and high-quality skeleton loaders.

## Tech Stack Context

- **Frontend**: Next.js 15 (App Router), React 19.
- **Styling**: Tailwind CSS v4, shadcn/ui.
- **Iconography**: lucide-react (customized where needed).
- **Fonts**: Geist (UI), Geist Mono (Technical).

## Phase 1: Foundational Brand Assets
- Define "Proprietary Blue & Gold" palette in `globals.css`.
- Create `BrandLogo` component in `src/components/ui/`.
- Setup a `ThemeToggle` for brand-compliant dark mode.

## Phase 2: Core Layouts and Navigation
- Refactor `(auth)/layout.tsx` for a "fancy" login experience.
- Implement the new `ModernLayout` for `(manager)`, `(tenant)`, and `(vendor)`.
- Apply glassmorphism to sidebars and headers.

## Phase 3: Page-by-Page Overhaul
- **Manager**: Dashboard stats, Property Cards, Request Tables.
- **Tenant**: Simplified Request Form, Property Overview.
- **Vendor**: Clear request focus and status management.

## Phase 4: Final Polish and Validation
- Standardize all badges and status indicators.
- Add "fancy" hover states to all interactive elements.
- Verify responsiveness and accessibility.

## Validation Strategy

### TDD Strategy
- Create snapshot tests for `BrandLogo` and `ModernLayout`.
- Verify CSS variables are correctly injected into the DOM via integration tests.

### Visual Validation
- Compare "Before" and "After" states for all major routes.
- Confirm consistency of color usage across all 3 user roles.
