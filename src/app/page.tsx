import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const ROLE_HOME: Record<string, string> = {
  TENANT: "/requests",
  MANAGER: "/dashboard",
  VENDOR: "/vendor/requests",
};

export default async function Home() {
  const session = await auth();
  
  if (session?.user?.role) {
    const home = ROLE_HOME[session.user.role as keyof typeof ROLE_HOME] || "/login";
    redirect(home);
  }
  
  redirect("/login");
}
