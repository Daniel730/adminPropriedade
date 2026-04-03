"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AddUnitForm } from "@/components/dashboard/AddUnitForm"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building2, Home, User, Wrench, ChevronRight, MapPin, Inbox } from "lucide-react"
import { ManageUnitModal } from "@/components/dashboard/ManageUnitModal"

interface Property {
  id: string
  name: string
  address: string
  units: Array<{
    id: string
    unitNumber: string
    tenant: { id: string; name: string; email: string } | null
    _count: {
      requests: number
    }
  }>
}

export default function PropertyDetailPageContent({
  property,
}: {
  property: Property
}) {
  const [selectedUnit, setSelectedUnit] = useState<Property["units"][0] | null>(null)

  const occupiedUnits = property.units.filter(u => u.tenant).length;
  const occupancyRate = property.units.length > 0 ? Math.round((occupiedUnits / property.units.length) * 100) : 0;

  return (
    <div className="space-y-10 animate-page-in">
      {selectedUnit && (
        <ManageUnitModal 
          unit={selectedUnit} 
          onClose={() => setSelectedUnit(null)} 
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-primary/10 text-primary">
            <Link href="/properties" title="Back to all properties">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {property.name}
            </h2>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 text-primary/60" />
              <p className="text-sm font-medium">{property.address}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/20">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">
            Active Asset
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <GlassCard className="flex items-center gap-4 py-4 px-6 border-none shadow-xl shadow-primary/5">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Units</p>
            <h3 className="text-2xl font-bold">{property.units.length}</h3>
          </div>
        </GlassCard>
        
        <GlassCard className="flex items-center gap-4 py-4 px-6 border-none shadow-xl shadow-primary/5">
          <div className="p-3 rounded-2xl bg-secondary/10 text-secondary">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Occupancy</p>
            <h3 className="text-2xl font-bold">{occupancyRate}%</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4 py-4 px-6 border-none shadow-xl shadow-primary/5">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Open Tasks</p>
            <h3 className="text-2xl font-bold">{property.units.reduce((sum, u) => sum + u._count.requests, 0)}</h3>
          </div>
        </GlassCard>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Units Inventory
          </h3>
          <AddUnitForm propertyId={property.id} />
        </div>

        <GlassCard className="p-0 overflow-hidden border-none shadow-2xl shadow-primary/5">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="font-bold text-foreground">Unit</TableHead>
                  <TableHead className="font-bold text-foreground">Occupant</TableHead>
                  <TableHead className="font-bold text-foreground">Active Requests</TableHead>
                  <TableHead className="text-right font-bold text-foreground">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {property.units.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-4 rounded-full bg-muted mb-2">
                          <Inbox className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <p className="text-xl font-bold tracking-tight">No units assigned</p>
                        <p className="text-sm">Start by adding your first residential unit.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  property.units.map((unit) => (
                    <TableRow key={unit.id} className="group transition-colors hover:bg-primary/5 border-muted/20">
                      <TableCell className="py-4 font-bold text-lg">
                        <span className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:bg-primary/10 transition-colors">
                          {unit.unitNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        {unit.tenant ? (
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {unit.tenant.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-foreground leading-none">{unit.tenant.name}</p>
                              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight mt-1">{unit.tenant.email}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-muted-foreground italic text-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                            Vacant Unit
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {unit._count.requests > 0 ? (
                          <Link
                            href={`/dashboard?propertyId=${property.id}&unitNumber=${unit.unitNumber}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold hover:bg-amber-500/20 transition-all"
                          >
                            <Wrench className="h-3 w-3" />
                            {unit._count.requests} Pending
                          </Link>
                        ) : (
                          <span className="text-muted-foreground text-xs font-medium flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> No Issues
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-full group/btn"
                          onClick={() => setSelectedUnit(unit)}
                        >
                          Manage <ChevronRight className="ml-1 h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}
