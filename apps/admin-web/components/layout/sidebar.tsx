"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  Scissors,
  Layers,
  Users,
  User,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { sidebarNavItems } from "@/lib/mock-data";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  Scissors,
  Layers,
  Users,
  User,
  BarChart3,
  Settings,
};

const NAV_ITEMS: NavItem[] = sidebarNavItems.map((item) => ({
  ...item,
  icon: iconMap[item.icon],
}));

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isCollapsed ? "4.5rem" : "16rem"
    );
  }, [isCollapsed]);

  return (
    <>
      <button
        className={cn(
          "fixed top-4 left-4 z-50 md:hidden rounded-lg bg-card border border-border p-2 shadow-card",
          "hover:bg-accent hover:text-accent-foreground transition-colors"
        )}
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <LayoutDashboard className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-card border-r border-border flex flex-col transition-all duration-300",
          "w-[var(--sidebar-width,16rem)] -translate-x-full md:translate-x-0",
          isMobileOpen && "translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-heading font-semibold text-lg text-foreground">
                    BookFlow
                  </span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isCollapsed ? "justify-center" : "justify-end"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <AnimatePresence key={item.href} mode="wait">
                {!isCollapsed && (
                  <motion.div
                    key={`${item.href}-tooltip`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                )}
                {isCollapsed && (
                  <Link
                    key={`${item.href}-collapsed`}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center mx-auto rounded-lg transition-all duration-200",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={item.label}
                    title={item.label}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                )}
              </AnimatePresence>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Quick Actions
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Link
                      href="/bookings"
                      className="rounded-lg bg-card p-3 text-center text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <CalendarCheck className="h-5 w-5 mx-auto mb-1" />
                      <span>New Booking</span>
                    </Link>
                    <Link
                      href="/services"
                      className="rounded-lg bg-card p-3 text-center text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Scissors className="h-5 w-5 mx-auto mb-1" />
                      <span>Add Service</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
}
