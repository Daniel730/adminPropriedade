/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { Pool } from "@neondatabase/serverless"

const prismaClientSingleton = () => {
  if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL?.startsWith("postgres")) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaNeon(pool)
    return new PrismaClient({ adapter } as any)
  } else {
    // For local dev with SQLite or regular Postgres without Neon adapter
    return new PrismaClient()
  }
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma

export default prisma
