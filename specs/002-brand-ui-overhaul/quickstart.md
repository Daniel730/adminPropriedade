# Quickstart: Brand Identity and UI/UX Overhaul

## Getting Started

1. **Verify Existing Styles**: Ensure current `globals.css` and `tailwind.config.ts` are using Tailwind v4.
2. **Setup Brand Assets**: Create `BrandLogo` component in `src/components/ui/`.
3. **Update CSS Variables**: Inject the new "Proprietary Blue & Gold" palette into `src/app/globals.css`.
4. **Layout Migration**: Apply the new `ModernLayout` to existing route groups: `(auth)`, `(manager)`, `(tenant)`, and `(vendor)`.

## Running the Overhaul

```bash
# Start dev server
pnpm dev

# Check UI visually at:
# /login (Unauthenticated)
# /dashboard (Manager)
# /requests (Tenant)
```

## Validation Checklist

- [ ] Check logo visibility in both light and dark modes.
- [ ] Confirm sidebar glassmorphism is working (backdrop blur).
- [ ] Verify property cards use the new `xl` radius and subtle shadows.
- [ ] Ensure buttons use the new Indigo/Gold brand palette.
