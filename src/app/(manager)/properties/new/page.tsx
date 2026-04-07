import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CreatePropertyForm } from "@/components/dashboard/CreatePropertyForm"

export default async function NewPropertyPage() {
  const session = await auth()
  if (!session || session.user.role !== "MANAGER") redirect("/login")

  return <CreatePropertyForm />
}
