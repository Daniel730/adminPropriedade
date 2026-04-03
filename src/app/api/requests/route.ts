import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isAccountRestricted } from "@/lib/subscription"
import { RequestStatus } from "@/lib/types"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (session.user.role !== "TENANT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const { title, description, unitId } = body

  if (!title || !description || !unitId) {
    return NextResponse.json(
      { error: "title, description, and unitId are required." },
      { status: 422 }
    )
  }

  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: { property: true },
  })

  if (!unit || unit.tenantId !== session.user.id) {
    return NextResponse.json(
      { error: "Unit does not belong to you." },
      { status: 422 }
    )
  }

  const restricted = await isAccountRestricted(unit.property.managerId)
  if (restricted) {
    return NextResponse.json(
      { error: "The property manager's account is restricted." },
      { status: 403 }
    )
  }

  const request = await prisma.maintenanceRequest.create({
    data: {
      title,
      description,
      status: RequestStatus.OPEN,
      unitId,
      tenantId: session.user.id,
    },
  })

  return NextResponse.json(
    {
      id: request.id,
      title: request.title,
      status: request.status,
      createdAt: request.createdAt,
    },
    { status: 201 }
  )
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const statusParam = searchParams.get("status") as RequestStatus | null
  const propertyIdParam = searchParams.get("propertyId")
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)))
  const skip = (page - 1) * limit

  const statusFilter = statusParam && Object.values(RequestStatus).includes(statusParam)
    ? statusParam
    : undefined

  if (session.user.role === "TENANT") {
    const where = {
      tenantId: session.user.id,
      ...(statusFilter ? { status: statusFilter } : {}),
    }

    const [total, requests] = await Promise.all([
      prisma.maintenanceRequest.count({ where }),
      prisma.maintenanceRequest.findMany({
        where,
        include: {
          unit: { include: { property: true } },
          vendor: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ])

    return NextResponse.json({
      data: requests,
      pagination: { page, limit, total },
    })
  }

  if (session.user.role === "MANAGER") {
    const properties = await prisma.property.findMany({
      where: { managerId: session.user.id },
      select: { id: true },
    })
    const ownedPropertyIds = properties.map((p) => p.id)

    if (propertyIdParam && !ownedPropertyIds.includes(propertyIdParam)) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 })
    }

    const targetPropertyIds = propertyIdParam ? [propertyIdParam] : ownedPropertyIds

    const where = {
      unit: { propertyId: { in: targetPropertyIds } },
      ...(statusFilter ? { status: statusFilter } : {}),
    }

    const [total, requests] = await Promise.all([
      prisma.maintenanceRequest.count({ where }),
      prisma.maintenanceRequest.findMany({
        where,
        include: {
          unit: { include: { property: true } },
          tenant: { select: { id: true, name: true, email: true } },
          vendor: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ])

    return NextResponse.json({
      data: requests,
      pagination: { page, limit, total },
    })
  }

  if (session.user.role === "VENDOR") {
    const where = {
      vendorId: session.user.id,
      ...(statusFilter ? { status: statusFilter } : {}),
    }

    const [total, requests] = await Promise.all([
      prisma.maintenanceRequest.count({ where }),
      prisma.maintenanceRequest.findMany({
        where,
        include: {
          unit: { include: { property: true } },
          tenant: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ])

    return NextResponse.json({
      data: requests,
      pagination: { page, limit, total },
    })
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
