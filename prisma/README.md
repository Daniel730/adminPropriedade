# Database Setup

## 1. Set DATABASE_URL
Update `.env.local` with your Neon PostgreSQL connection string.

## 2. Run migration
```bash
pnpm db:migrate --name init
```

## 3. Run seed
```bash
pnpm db:seed
```
This creates the 3 SubscriptionPlan tiers.
Requires `STRIPE_STARTER_PRICE_ID`, `STRIPE_GROWTH_PRICE_ID`, `STRIPE_PROFESSIONAL_PRICE_ID` in `.env.local`.

## 4. Generate Prisma client (after schema changes)
```bash
pnpm db:generate
```
