import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserPlus, Users, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function VendorsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const vendors = await prisma.user.findMany({
    where: {
      role: "VENDOR",
      vendorManagerId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground mt-1">
            Manage your network of service providers
          </p>
        </div>
        <Button asChild>
          <Link href="/vendors/new">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Vendor
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{vendors.length}</p>
              <p className="text-xs text-muted-foreground">Active Vendors</p>
            </div>
          </div>
        </div>
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold">100%</p>
              <p className="text-xs text-muted-foreground">Compliance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vendors List */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="font-semibold">Vendor Directory</h2>
        </div>
        
        {vendors.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No vendors yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Invite service providers to your network
            </p>
            <Button asChild>
              <Link href="/vendors/new">Invite Vendor</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Mobile List View */}
            <div className="md:hidden divide-y">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {vendor.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{vendor.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">{vendor.email}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground">Name</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Email</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Joined</TableHead>
                    <TableHead className="text-right text-xs font-medium text-muted-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => (
                    <TableRow key={vendor.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                            {vendor.name.charAt(0)}
                          </div>
                          <span className="font-medium">{vendor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {vendor.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(vendor.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
