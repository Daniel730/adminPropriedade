import React from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden">
        <div className="relative z-10">
          <BrandLogo size="lg" className="text-white" />
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 bg-background/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <blockquote className="space-y-4">
            <p className="text-4xl font-bold text-white tracking-tight leading-tight">
              Modernizing property management with a touch of <span className="text-secondary">elegance</span>.
            </p>
            <footer className="text-primary-foreground/80 font-medium">
              &mdash; The Proprietary Team
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex flex-col justify-center items-center p-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="lg:hidden flex justify-center mb-8">
            <BrandLogo size="md" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
