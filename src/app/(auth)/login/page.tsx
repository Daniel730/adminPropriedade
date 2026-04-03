import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";

export default async function LoginPage() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Enter your credentials to access your properties
        </p>
      </div>

      <GlassCard className="border-none shadow-2xl shadow-primary/5 p-8" hoverable={false}>
        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", {
              ...Object.fromEntries(formData),
              redirectTo: "/dashboard",
            });
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              className="h-12 rounded-xl bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="h-12 rounded-xl bg-background/50"
            />
          </div>
          <Button type="submit" variant="brand" size="lg" className="w-full mt-6">
            Sign In
          </Button>
        </form>
      </GlassCard>

      <p className="text-center text-sm text-muted-foreground px-8">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
