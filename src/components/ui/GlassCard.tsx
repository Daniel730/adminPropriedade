import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  variant?: "default" | "bordered" | "elevated";
}

export function GlassCard({ 
  children, 
  className, 
  hoverable = true,
  variant = "default"
}: GlassCardProps) {
  return (
    <div className={cn(
      "rounded-xl p-6 transition-all duration-200",
      variant === "default" && "bg-card border border-border",
      variant === "bordered" && "bg-card border-2 border-border",
      variant === "elevated" && "bg-card border border-border shadow-lg shadow-foreground/5",
      hoverable && "hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
      className
    )}>
      {children}
    </div>
  );
}
