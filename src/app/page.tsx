import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingPage from "./(marketing)/page";
import { ROLE_HOME } from "@/lib/constants";
import { Role } from "@/lib/types";

export default async function Home() {
  const session = await auth();
  
  if (session?.user?.role) {
    const home = ROLE_HOME[session.user.role as Role] || "/login";
    redirect(home);
  }
  
  // Show landing page for unauthenticated users
  return <LandingPage />;
}
