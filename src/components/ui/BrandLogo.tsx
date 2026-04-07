import React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "default" | "white";
}

const sizeMap = {
  sm: { icon: "h-6 w-6", text: "text-lg", gap: "gap-2" },
  md: { icon: "h-8 w-8", text: "text-xl", gap: "gap-2.5" },
  lg: { icon: "h-10 w-10", text: "text-2xl", gap: "gap-3" },
  xl: { icon: "h-12 w-12", text: "text-3xl", gap: "gap-3" },
};

export function BrandLogo({ className, size = "md", showText = true, variant = "default" }: BrandLogoProps) {
  const sizes = sizeMap[size];
  
  return (
    <div className={cn("flex items-center", sizes.gap, className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-xl",
        sizes.icon,
        variant === "white" 
          ? "bg-white/10" 
          : "bg-primary/10"
      )}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn(
            "w-[60%] h-[60%]",
            variant === "white" ? "text-white" : "text-primary"
          )}
        >
          <path
            d="M3 9.5L12 4L21 9.5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V9.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 21V12H15V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className={cn(
          "absolute -bottom-0.5 -right-0.5 rounded-full p-0.5",
          variant === "white" ? "bg-white" : "bg-background"
        )}>
          <div className={cn(
            "w-2 h-2 rounded-full",
            variant === "white" ? "bg-white" : "bg-primary"
          )} />
        </div>
      </div>
      {showText && (
        <span className={cn(
          sizes.text,
          "font-semibold tracking-tight",
          variant === "white" ? "text-white" : "text-foreground"
        )}>
          PropFlow
        </span>
      )}
    </div>
  );
}
