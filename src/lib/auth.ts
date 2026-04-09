/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { authConfig } from "./auth.config"

const { handlers, auth: nextAuth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user) {
          return null
        }

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
})

export const auth = async (...args: any[]) => {
  if (process.env.NEXT_PUBLIC_AUTH_BYPASS === "true") {
    // Return a mock session for God Mode
    return {
      user: {
        id: "mock-god-mode-id",
        name: "God Mode User",
        email: "godmode@propflow.local",
        role: process.env.NEXT_PUBLIC_AUTH_BYPASS_ROLE || "MANAGER",
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  }
  return (nextAuth as any)(...args)
}

export { handlers, signIn, signOut }

