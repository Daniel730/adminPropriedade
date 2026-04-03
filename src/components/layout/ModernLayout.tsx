"use client";

import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Building2, 
  Wrench, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  CreditCard,
  Bell
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface ModernLayoutProps {
  children: React.ReactNode;
  role: "MANAGER" | "TENANT" | "VENDOR";
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  MANAGER: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Properties", href: "/properties", icon: Building2 },
    { label: "Vendors", href: "/vendors", icon: Users },
    { label: "Billing", href: "/billing", icon: CreditCard },
  ],
  TENANT: [
    { label: "My Requests", href: "/requests", icon: Wrench },
    { label: "Property", href: "/property", icon: Building2 },
  ],
  VENDOR: [
    { label: "Open Requests", href: "/vendor/requests", icon: Wrench },
  ],
};

export function ModernLayout({ children, role }: ModernLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role] || [];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <BrandLogo size="sm" />
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 w-72 bg-card/40 backdrop-blur-xl border-r z-[70] transition-transform duration-300 ease-in-out md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <BrandLogo />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary-foreground" : "group-hover:text-primary"
                  )} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t space-y-1">
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
            >
              <Settings className="h-5 w-5 group-hover:text-primary" />
              <span className="font-medium">Settings</span>
            </Link>
            <div className="flex items-center justify-between px-4 py-3">
              <ThemeToggle />
              <form action={logoutAction}>
                <Button 
                  type="submit"
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-background/40 backdrop-blur-md border-b">
          <h1 className="text-xl font-semibold capitalize tracking-tight">
            {pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-secondary rounded-full border-2 border-background" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/20">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
