# Research: Brand Identity and UI/UX Overhaul

## Tech Decisions

### 1. Brand Identity: "Proprietary Blue & Gold"
- **Primary Color**: `Royal Indigo` (#4338ca) - Feels professional, trustable, and high-end.
- **Secondary Color**: `Amber Gold` (#fbbf24) - Used for high-impact accents and "Success" states in a "premium" way.
- **Surface Strategy**: Use `Zinc` (slate-like) for backgrounds but with subtle `Royal Indigo` tints in dark mode to avoid "flat" blacks.
- **Logo**: A stylized house icon with a checkmark, using the `Royal Indigo` and `Amber Gold` colors.

### 2. UI Patterns: "Modern Professionalism"
- **Glassmorphism**: Sidebar and Header will use `backdrop-blur-md` and `bg-white/80` (light) or `bg-zinc-950/80` (dark).
- **Cards**: High-contrast cards with `border-zinc-200/50` and subtle `shadow-sm` that scales to `shadow-lg` on hover.
- **Spacing**: Increased white space (looser than default) to give a "premium" feel.
- **Radius**: Uniform `xl` (12px) for cards and `lg` (8px) for inputs to feel "softer" and more modern.

### 3. Typography
- **UI Font**: `Inter` (already in use via Geist, but we'll stick to a clean, high-legibility sans).
- **Heading Font**: `Geist` with `tracking-tight` and `font-bold` for a technical, modern look.

### 4. Animations
- **Micro-interactions**: Use `framer-motion` (check if installed) or Tailwind's `transition` for smooth hover states.
- **Page Transitions**: Simple `opacity` fade-in for new pages.

## Alternatives Considered

- **Tailwind Emerald**: Too "standard" for property management (often used for finance/savings).
- **Radix Colors**: Great for flexibility, but manual HSL variables in `globals.css` provide more "brandify" control for this specific overhaul.

## Verification Plan

- **Visual Comparison**: Side-by-side screenshots of "Before" vs "After."
- **Accessibility**: Ensure contrast ratios for Indigo/Gold meet WCAG AA.
