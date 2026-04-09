import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ROLE_HOME } from "@/lib/constants"
import { Role } from "@/lib/types"

const { auth } = NextAuth(authConfig)

// Routes that are always public
const PUBLIC_ROUTES = ["/login", "/api/billing/plans", "/api/webhooks/stripe"]
const PUBLIC_ROUTE_PREFIXES = ["/api/auth"]

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true
  if (PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix)))
    return true
  return false
}

// Routes that require authentication (protected)
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/properties",
  "/vendors",
  "/billing",
  "/requests",
  "/vendor",
  "/api/properties",
  "/api/units",
  "/api/vendors",
  "/api/requests",
  "/api/notifications",
  "/api/billing",
  "/api/search",
  "/api/tenants",
  "/settings",
  "/api/user",
]

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

// Role home routes moved to lib/constants.ts

// Allowed path prefixes per role
const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  TENANT: ["/requests", "/api/requests", "/api/notifications", "/settings", "/api/user"],
  MANAGER: [
    "/dashboard",
    "/properties",
    "/vendors",
    "/billing",
    "/api/properties",
    "/api/units",
    "/api/vendors",
    "/api/requests",
    "/api/notifications",
    "/api/billing",
    "/settings",
    "/api/user",
  ],
  VENDOR: ["/vendor/requests", "/api/requests", "/api/notifications", "/settings", "/api/user"],
}

function isAllowedForRole(pathname: string, role: string): boolean {
  const allowed = ROLE_ALLOWED_PREFIXES[role]
  if (!allowed) return false
  return allowed.some((prefix) => pathname.startsWith(prefix))
}

export default auth(function middleware(req: NextRequest & { auth: { user?: { role?: string; id?: string } } | null }) {
  const { pathname } = req.nextUrl

  // If already logged in, redirect away from login
  if (pathname === "/login") {
    const session = req.auth
    if (session?.user?.role) {
      const home = ROLE_HOME[session.user.role as Role] ?? "/dashboard"
      return NextResponse.redirect(new URL(home, req.url))
    }
    return NextResponse.next()
  }

  // Always allow other public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // For protected routes, check auth
  if (isProtectedRoute(pathname)) {
    const session = req.auth

    if (!session || !session.user) {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("callbackUrl", req.url)
      return NextResponse.redirect(loginUrl)
    }

    const role = session.user.role

    if (role && !isAllowedForRole(pathname, role)) {
      const home = ROLE_HOME[role as Role] ?? "/login"
      return NextResponse.redirect(new URL(home, req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
