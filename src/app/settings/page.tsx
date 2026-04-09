import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ModernLayout } from "@/components/layout/ModernLayout"
import { SettingsForm } from "@/components/settings/SettingsForm"

export default async function SettingsPage() {
  const session = await auth()
  if (!session) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true }
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <ModernLayout role={user.role as any}>
      <SettingsForm user={user} />
    </ModernLayout>
  )
}
