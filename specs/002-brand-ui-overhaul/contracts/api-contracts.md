# API Contracts: Brand Identity and UI/UX Overhaul

## Existing API Interactions

The UI overhaul will consume existing API routes. No changes to payloads are required.

- **GET /api/properties**: Consumed by the new Manager Dashboard Card View.
- **POST /api/requests**: Consumed by the new Tenant "Request Form" (polished UI).
- **PATCH /api/requests/[id]**: Consumed by the new Vendor/Manager update flow.

## New UI Components (Internal "Contracts")

### `BrandLogo`
- **Props**: `size: 'sm' | 'md' | 'lg'`, `variant: 'full' | 'icon'`
- **Returns**: SVG Brand Identity logo.

### `ModernLayout`
- **Props**: `children`, `role: 'TENANT' | 'MANAGER' | 'VENDOR'`
- **Returns**: Responsive layout with Glassmorphism sidebar/header.

### `StatusBadge`
- **Props**: `status: RequestStatus`
- **Returns**: Refined, modern badge with color accents based on the new brand palette.
