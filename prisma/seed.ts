import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const starterPriceId =
    process.env.STRIPE_STARTER_PRICE_ID ?? "price_starter_placeholder"
  const growthPriceId =
    process.env.STRIPE_GROWTH_PRICE_ID ?? "price_growth_placeholder"
  const professionalPriceId =
    process.env.STRIPE_PROFESSIONAL_PRICE_ID ?? "price_professional_placeholder"

  const plans = [
    {
      name: "Free",
      unitLimit: 2,
      priceMonthyCents: 0,
      stripePriceId: null,
      adsEnabled: true,
    },
    {
      name: "Starter",
      unitLimit: 10,
      priceMonthyCents: 2900,
      stripePriceId: starterPriceId,
      adsEnabled: false,
    },
    {
      name: "Growth",
      unitLimit: 50,
      priceMonthyCents: 7900,
      stripePriceId: growthPriceId,
      adsEnabled: false,
    },
    {
      name: "Professional",
      unitLimit: 200,
      priceMonthyCents: 14900,
      stripePriceId: professionalPriceId,
      adsEnabled: false,
    },
  ]

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: {
        unitLimit: plan.unitLimit,
        priceMonthyCents: plan.priceMonthyCents,
        stripePriceId: plan.stripePriceId,
        adsEnabled: plan.adsEnabled,
      },
      create: plan,
    })
    console.log(`Upserted plan: ${plan.name}`)
  }

  const passwordHash = await bcrypt.hash("password123", 10)

  // Add dummy users
  const manager = await prisma.user.upsert({
    where: { email: "manager@example.com" },
    update: { passwordHash, id: "dummy-manager-id", role: "MANAGER" },
    create: {
      id: "dummy-manager-id",
      email: "manager@example.com",
      name: "Dummy Manager",
      passwordHash,
      role: "MANAGER",
    },
  })
  console.log(`Upserted MANAGER: ${manager.email}`)

  const tenant = await prisma.user.upsert({
    where: { email: "tenant@example.com" },
    update: { passwordHash, id: "dummy-tenant-id", role: "TENANT" },
    create: {
      id: "dummy-tenant-id",
      email: "tenant@example.com",
      name: "Dummy Tenant",
      passwordHash,
      role: "TENANT",
    },
  })
  console.log(`Upserted TENANT: ${tenant.email}`)

  const vendor = await prisma.user.upsert({
    where: { email: "vendor@example.com" },
    update: { passwordHash, id: "dummy-vendor-id", role: "VENDOR" },
    create: {
      id: "dummy-vendor-id",
      email: "vendor@example.com",
      name: "Dummy Vendor",
      passwordHash,
      role: "VENDOR",
    },
  })
  console.log(`Upserted VENDOR: ${vendor.email}`)

  // Create dummy property and unit
  const property = await prisma.property.upsert({
    where: { id: "dummy-property-id" },
    update: {},
    create: {
      id: "dummy-property-id",
      name: "Ocean View Apartments",
      address: "123 Coastal Way",
      managerId: manager.id,
    },
  })
  console.log(`Upserted Property: ${property.name}`)

  const unit = await prisma.unit.upsert({
    where: { id: "dummy-unit-id" },
    update: { tenantId: tenant.id },
    create: {
      id: "dummy-unit-id",
      propertyId: property.id,
      unitNumber: "101",
      tenantId: tenant.id,
    },
  })
  console.log(`Upserted Unit: ${unit.unitNumber}`)

  console.log("Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
