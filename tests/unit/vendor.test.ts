import { describe, it, expect, vi } from 'vitest'
import { GET, POST } from '@/app/api/vendors/route'
import { NextRequest } from 'next/server'

// Mock the auth and prisma modules
vi.mock('@/lib/auth', () => ({
  auth: vi.fn().mockResolvedValue({
    user: { id: 'manager-id', role: 'MANAGER' }
  })
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: vi.fn().mockResolvedValue([
        { id: 'vendor-1', name: 'Vendor 1', email: 'vendor1@example.com' }
      ]),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({
        id: 'new-vendor', name: 'New Vendor', email: 'new@example.com'
      })
    }
  }
}))

describe('Vendor API', () => {
  it('GET returns list of vendors for manager', async () => {
    const res = await GET()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toHaveLength(1)
    expect(json[0].name).toBe('Vendor 1')
  })

  it('POST creates a new vendor', async () => {
    const req = new NextRequest('http://localhost:3000/api/vendors', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Vendor', email: 'new@example.com', password: 'pass' })
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.name).toBe('New Vendor')
  })
})
