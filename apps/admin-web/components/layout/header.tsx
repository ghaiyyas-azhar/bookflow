"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { mockNotifications } from "@/lib/mock-data";
import { NotificationDetailDialog } from "@/components/notifications/notification-detail-dialog";
import {
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
  User as UserIcon,
  Settings,
  ChevronDown,
  CalendarCheck,
  Scissors,
  type LucideIcon,
} from "lucide-react";
import type { Notification } from "@/types";

interface UserMenuItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  onClick?: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
}

export function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  const [selectedNotification, setSelectedNotification] = React.useState<Notification | null>(null);
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const notificationsRef = React.useRef<HTMLDivElement>(null);
  const isMounted = React.useRef(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const userMenuItems: UserMenuItem[] = [
    { label: "My Profile", href: "/settings", icon: UserIcon },
    { label: "Business Settings", href: "/settings", icon: Settings },
    { label: "Account Preferences", href: "/settings", icon: ChevronDown },
    { label: "Sign Out", icon: LogOut, variant: "destructive", disabled: true },
  ];

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
    setIsNotificationsOpen(false);
  }, [pathname]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, unread: false } : notif))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, unread: false })));
  };

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    // Check if View Transitions API is supported and user has not requested reduced motion
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || isReducedMotion) {
      setTheme(nextTheme);
      return;
    }

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 400,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <header className="sticky top-3 z-30 mb-6 flex items-center gap-4">
      {/* Search pill */}
      <div className="relative flex-1 max-w-lg hidden md:block" ref={searchRef}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
          onFocus={() => setIsSearchOpen(true)}
          placeholder="Search bookings, customers..."
          className="w-full glass-pill rounded-full h-11 pl-11 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          aria-label="Search"
        />
        <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-1 rounded-md bg-muted/60 px-1.5 text-[10px] font-mono text-muted-foreground pointer-events-none">
          <span>⌘</span>K
        </kbd>

        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-0 right-0 top-full mt-3 glass-card rounded-2xl p-3 max-h-64 overflow-y-auto"
            >
              <div className="space-y-2">
                {[
                  { href: "/bookings", label: "Recent Bookings", icon: CalendarCheck },
                  { href: "/customers", label: "Customers", icon: UserIcon },
                  { href: "/services", label: "Services", icon: Scissors },
                ]
                  .filter((i) => i.label.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-muted/60 transition-colors"
                    >
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right floating controls */}
      <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleThemeToggle}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full glass-pill transition-all",
              "hover:ring-2 hover:ring-ring/40",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            )}
            aria-label="Toggle theme"
            aria-pressed={theme === "dark"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={cn(
                "relative flex h-10 w-10 items-center justify-center rounded-full glass-pill transition-all",
                "hover:ring-2 hover:ring-ring/40",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              )}
              aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
              aria-expanded={isNotificationsOpen}
              aria-haspopup="true"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] origin-top-right rounded-lg bg-popover border border-border shadow-popover py-1 max-h-80 overflow-y-auto"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">Notifications</p>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => {
                        setSelectedNotification(notification);
                        setIsNotificationsOpen(false);
                      }}
                      className={cn(
                        "cursor-pointer px-3 py-3 hover:bg-accent transition-colors border-b border-border last:border-0",
                        notification.unread && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={cn(
                            "h-2 w-2 mt-1.5 rounded-full flex-shrink-0",
                            notification.unread ? "bg-primary" : "bg-muted-foreground/40"
                          )}
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-snug">
                            {notification.title}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                            {notification.description}
                          </p>
                          <p className="mt-1 text-[10px] text-muted-foreground/70">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="px-3 py-2 border-t border-border">
                    <Link
                      href="/notifications"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="block text-center text-sm font-medium text-primary hover:underline"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <NotificationDetailDialog
            notification={selectedNotification}
            open={!!selectedNotification}
            onOpenChange={(open) => !open && setSelectedNotification(null)}
            onMarkAsRead={handleMarkAsRead}
          />

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full glass-pill transition-all",
                "hover:ring-2 hover:ring-ring/40",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              )}
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <UserIcon className="h-4 w-4" />
              </div>
            </button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] origin-top-right rounded-lg bg-popover border border-border shadow-popover py-1 max-h-[calc(100vh-6rem)] overflow-y-auto"
                >
                  <div className="px-3 py-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                        <UserIcon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          Admin User
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          admin@bookflow.com
                        </p>
                        <p className="mt-0.5 text-[10px] font-medium text-primary uppercase tracking-wider">
                          Administrator
                        </p>
                      </div>
                    </div>
                  </div>
                  {userMenuItems.map((item) => {
                    if (item.disabled) {
                      return (
                        <div
                          key={item.label}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm opacity-40 cursor-not-allowed",
                            item.variant === "destructive" && "text-destructive"
                          )}
                          title="Authentication not yet implemented"
                          aria-disabled="true"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                      );
                    }
                    return item.href ? (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsUserMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    ) : null;
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
      </div>
    </header>
  );
}