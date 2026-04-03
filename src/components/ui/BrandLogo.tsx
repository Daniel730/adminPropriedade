import React from "react";
import { Home, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

const sizeMap = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const textMap = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
  xl: "text-4xl",
};

export function BrandLogo({ className, size = "md", showText = true }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        <Home 
          className={cn(sizeMap[size], "text-primary fill-primary/10")} 
          strokeWidth={1.5}
        />
        <CheckCircle2 
          className={cn(
            size === "sm" ? "h-3 w-3" : "h-4 w-4",
            "absolute -bottom-1 -right-1 text-secondary bg-background rounded-full p-0.5"
          )} 
          strokeWidth={2.5}
        />
      </div>
      {showText && (
        <span className={cn(
          textMap[size],
          "font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
        )}>
          Proprietary<span className="text-secondary">.</span>
        </span>
      )}
    </div>
  );
}
