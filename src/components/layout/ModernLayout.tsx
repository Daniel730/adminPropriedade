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
  Bell,
  Search,
  ChevronRight
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

const ROLE_LABELS: Record<string, string> = {
  MANAGER: "Property Manager",
  TENANT: "Tenant",
  VENDOR: "Vendor",
};

export function ModernLayout({ children, role }: ModernLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role] || [];

  const getPageTitle = () => {
    const segment = pathname.split("/").filter(Boolean).pop() || "dashboard";
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 h-16 border-b bg-background/95 backdrop-blur-sm z-50">
        <BrandLogo size="sm" />
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-lg">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-lg" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 w-64 h-screen bg-card border-r z-[70] transition-transform duration-300 ease-out md:translate-x-0 flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b">
          <BrandLogo size="sm" />
          <Button variant="ghost" size="icon" className="md:hidden rounded-lg" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <div className="flex items-center justify-between px-3 py-2">
            <ThemeToggle />
            <form action={logoutAction}>
              <Button 
                type="submit"
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen md:min-h-0">
        {/* Top Bar */}
        <header className="hidden md:flex items-center justify-between px-6 h-16 border-b bg-background sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{ROLE_LABELS[role]}</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{getPageTitle()}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Search...</span>
              <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">&#8984;</span>K
              </kbd>
            </Button>
            <Button variant="ghost" size="icon" className="relative rounded-lg">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="text-xs font-medium text-primary">
                {role.charAt(0)}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8 pt-20 md:pt-6 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
