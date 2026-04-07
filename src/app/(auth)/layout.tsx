import React from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Building2, Shield, Zap, Users } from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Property Management",
    description: "Manage all your properties from a single dashboard"
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Real-time notifications for maintenance requests"
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Enterprise-grade security for your data"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Connect tenants, vendors, and managers seamlessly"
  }
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand Side */}
      <div className="hidden lg:flex flex-col justify-between p-10 bg-foreground text-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <BrandLogo size="lg" variant="white" />
        </div>
        
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-balance leading-tight">
              The complete platform for property management.
            </h1>
            <p className="mt-4 text-lg text-background/70 max-w-md">
              Streamline maintenance, billing, and tenant communication in one powerful dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="p-4 rounded-xl bg-background/5 border border-background/10">
                <feature.icon className="h-5 w-5 text-primary mb-3" />
                <h3 className="font-medium text-sm">{feature.title}</h3>
                <p className="text-xs text-background/60 mt-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-background/50">
            Trusted by 500+ property managers worldwide
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex flex-col justify-center items-center p-6 lg:p-10 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex justify-center mb-8">
            <BrandLogo size="md" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
