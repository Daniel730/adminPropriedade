import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function GlassCard({ children, className, hoverable = true }: GlassCardProps) {
  return (
    <div className={cn(
      "bg-card/40 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 transition-all duration-300",
      hoverable && "hover:bg-card/60 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1",
      className
    )}>
      {children}
    </div>
  );
}
