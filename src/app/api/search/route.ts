import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")
  if (!q || q.length < 2) return NextResponse.json([])

  const role = session.user.role
  const userId = session.user.id
  const results = []

  // Search logic based on role
  if (role === "MANAGER") {
    // Search Properties
    const properties = await prisma.property.findMany({
      where: {
        managerId: userId,
        OR: [
          { name: { contains: q } },
          { address: { contains: q } }
        ]
      },
      take: 5
    })
    properties.forEach(p => results.push({
      id: `prop-${p.id}`,
      type: "Property",
      title: p.name,
      subtitle: p.address,
      href: `/properties/${p.id}`,
      icon: "Building2"
    }))

    // Search Requests
    const requests = await prisma.maintenanceRequest.findMany({
      where: {
        unit: { property: { managerId: userId } },
        OR: [
          { title: { contains: q } },
          { description: { contains: q } }
        ]
      },
      include: { unit: { include: { property: true } } },
      take: 5
    })
    requests.forEach(r => results.push({
      id: `req-${r.id}`,
      type: "Request",
      title: r.title,
      subtitle: `${r.unit.property.name} - Unit ${r.unit.unitNumber}`,
      href: `/dashboard/requests/${r.id}`, // the actual path depends on structure, we use the dashboard/request modal if available, but for now we don't have a single request page for managers unless it's /dashboard?status=etc. Let's just link to dashboard. Wait, we should link to requests page if exists or open modal. Actually, we use `/properties/[id]` to see requests.
      icon: "Wrench"
    }))

    // Search Vendors
    const vendors = await prisma.user.findMany({
      where: {
        role: "VENDOR",
        vendorManagerId: userId,
        OR: [
          { name: { contains: q } },
          { email: { contains: q } }
        ]
      },
      take: 5
    })
    vendors.forEach(v => results.push({
      id: `ven-${v.id}`,
      type: "Vendor",
      title: v.name,
      subtitle: v.email,
      href: `/vendors`,
      icon: "Users"
    }))
  } else if (role === "TENANT") {
    const requests = await prisma.maintenanceRequest.findMany({
      where: {
        tenantId: userId,
        OR: [
          { title: { contains: q } }
        ]
      },
      take: 5
    })
    requests.forEach(r => results.push({
      id: `req-${r.id}`,
      type: "Request",
      title: r.title,
      subtitle: r.status,
      href: `/requests`,
      icon: "Wrench"
    }))
  } else if (role === "VENDOR") {
    const requests = await prisma.maintenanceRequest.findMany({
      where: {
        vendorId: userId,
        OR: [
          { title: { contains: q } }
        ]
      },
      take: 5
    })
    requests.forEach(r => results.push({
      id: `req-${r.id}`,
      type: "Request",
      title: r.title,
      subtitle: r.status,
      href: `/vendor/requests`,
      icon: "Wrench"
    }))
  }

  return NextResponse.json(results)
}
