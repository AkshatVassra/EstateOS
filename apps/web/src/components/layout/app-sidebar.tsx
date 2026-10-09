"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  MessageSquare,
  Megaphone,
  Sparkles,
  BarChart3,
  Calendar,
  Bell,
  CheckSquare,
  CreditCard,
  Settings,
  LifeBuoy,
  Shield,
  Zap,
  PanelLeftClose,
  PanelLeft,
  Search,
  Bell as BellIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

const nav = [
  { href: "/command-center", label: "Command Center", icon: Zap, group: "Core" },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Core" },
  { href: "/leads", label: "Leads", icon: Users, group: "Pipeline" },
  { href: "/messages", label: "Messages", icon: MessageSquare, group: "Pipeline" },
  { href: "/properties", label: "Properties", icon: Building2, group: "Inventory" },
  { href: "/marketing", label: "Marketing", icon: Megaphone, group: "Growth" },
  { href: "/ai-studio", label: "AI Studio", icon: Sparkles, group: "Growth" },
  { href: "/analytics", label: "Analytics", icon: BarChart3, group: "Insights" },
  { href: "/appointments", label: "Appointments", icon: Calendar, group: "Operations" },
  { href: "/tasks", label: "Tasks", icon: CheckSquare, group: "Operations" },
  { href: "/notifications", label: "Alerts", icon: Bell, group: "Operations" },
  { href: "/team", label: "Team", icon: Users, group: "Admin" },
  { href: "/billing", label: "Billing", icon: CreditCard, group: "Admin" },
  { href: "/settings", label: "Settings", icon: Settings, group: "Admin" },
  { href: "/support", label: "Support", icon: LifeBuoy, group: "Admin" },
  { href: "/admin", label: "Admin", icon: Shield, group: "Admin" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const groupedNav = nav.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof nav>);

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-border bg-background transition-all duration-300",
        collapsed ? "w-[80px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-border">
        {!collapsed && (
          <Link href="/command-center" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Estate<span className="text-muted-foreground">OS</span>
            </span>
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6 scrollbar-thin">
        {Object.entries(groupedNav).map(([group, items]) => (
          <div key={group}>
            {!collapsed && (
              <h4 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group}
              </h4>
            )}
            <div className="space-y-1">
              {items.map(({ href, label, icon: Icon }) => {
                const active = mounted ? (pathname === href || pathname.startsWith(`${href}/`)) : false;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-accent text-white shadow-md shadow-accent/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    title={collapsed ? label : undefined}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

    </aside>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search leads, properties, messages..."
                className="h-10 pl-10 pr-4 rounded-xl border border-border bg-muted/50 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-danger" />
            </Button>
            <UserButton />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
