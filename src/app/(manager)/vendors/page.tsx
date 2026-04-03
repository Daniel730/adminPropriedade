import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/button"
import { UserPlus, Users, Mail, Calendar, Search, Inbox, ChevronRight } from "lucide-react"
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
    <div className="space-y-10 animate-page-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Service Vendors
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">
            Manage your network of trusted service providers.
          </p>
        </div>
        <Button asChild variant="brand" size="lg" className="shadow-primary/20 group">
          <Link href="/vendors/new">
            <UserPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> Invite Vendor
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <GlassCard className="flex items-center gap-4 py-4 px-6 border-none shadow-xl shadow-primary/5">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Vendors</p>
            <h3 className="text-2xl font-bold">{vendors.length}</h3>
          </div>
        </GlassCard>
        
        <GlassCard className="flex items-center gap-4 py-4 px-6 border-none shadow-xl shadow-primary/5">
          <div className="p-3 rounded-2xl bg-secondary/10 text-secondary">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Compliance</p>
            <h3 className="text-2xl font-bold">100%</h3>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden border-none shadow-2xl shadow-primary/5" hoverable={false}>
        <div className="p-6 border-b bg-card/50">
          <h3 className="text-xl font-bold tracking-tight text-foreground">Vendor Directory</h3>
          <p className="text-sm text-muted-foreground">Detailed overview of your assigned service personnel.</p>
        </div>
        
        {vendors.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-muted mb-2">
                <Inbox className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-xl font-bold tracking-tight text-foreground">No vendors found</p>
              <p className="text-sm">Expand your network by inviting service providers.</p>
              <Button asChild variant="outline" className="mt-4" size="sm">
                <Link href="/vendors/new">Invite First Vendor</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile List View */}
            <div className="grid divide-y md:hidden">
              {vendors.map((v) => (
                <div key={v.id} className="p-5 active:bg-primary/5 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg shadow-sm">
                        {v.name.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-foreground">{v.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{v.email}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 border shrink-0">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    <Calendar className="h-3 w-3" />
                    <span>Registered {new Date(v.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="font-bold text-foreground px-8 py-5">Personnel</TableHead>
                    <TableHead className="font-bold text-foreground py-5">Contact Email</TableHead>
                    <TableHead className="font-bold text-foreground py-5">Registry Date</TableHead>
                    <TableHead className="text-right font-bold text-foreground px-8 py-5">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((v) => (
                    <TableRow key={v.id} className="group transition-colors hover:bg-primary/5 border-muted/20">
                      <TableCell className="py-5 px-8">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shadow-sm">
                            {v.name.charAt(0)}
                          </div>
                          <div className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {v.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />
                          <span className="text-sm font-medium">{v.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium">{new Date(v.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-5 px-8">
                        <Button variant="ghost" size="sm" className="rounded-full group/btn font-bold text-xs uppercase tracking-widest h-9">
                          Manage <ChevronRight className="ml-1 h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  )
}
