import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { InviteVendorForm } from "@/components/dashboard/InviteVendorForm"
import { ShieldCheck, Sparkles } from "lucide-react"

export default async function NewVendorPage() {
  const session = await auth()
  if (!session || session.user.role !== "MANAGER") redirect("/login")

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-page-in">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/20 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">
            Professional Network
          </span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Invite Service Provider
        </h2>
        <div className="flex items-center justify-center gap-2 text-muted-foreground bg-muted/30 w-fit mx-auto px-4 py-1.5 rounded-full border">
          <ShieldCheck className="h-4 w-4 text-primary/60" />
          <p className="text-sm font-bold">
            Trusted Professional Onboarding
          </p>
        </div>
      </div>

      <InviteVendorForm />
    </div>
  )
}
