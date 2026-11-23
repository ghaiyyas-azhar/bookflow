"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { mockNotifications } from "@/lib/mock-data";
import { NotificationDetailDialog } from "@/components/notifications/notification-detail-dialog";
import { Bell, BellOff, CheckCheck, Filter } from "lucide-react";
import type { Notification } from "@/types";

const TYPE_LABELS: Record<Notification["type"], string> = {
  booking: "Bookings",
  staff: "Staff",
  report: "Reports",
  system: "System",
  service: "Services",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = React.useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = React.useState<Notification["type"] | "all">("all");
  const [selectedNotification, setSelectedNotification] = React.useState<Notification | null>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications = notifications.filter((notif) => {
    const matchesReadStatus =
      filter === "all" || (filter === "unread" && notif.unread) || (filter === "read" && !notif.unread);
    const matchesType = typeFilter === "all" || notif.type === typeFilter;
    return matchesReadStatus && matchesType;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, unread: false } : notif))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, unread: false })));
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, unread: true } : notif))
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
              "transition-all hover:bg-primary/90",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            )}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-colors",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                filter === f
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-muted p-1 overflow-x-auto">
          <span className="px-2 text-xs text-muted-foreground flex items-center gap-1">
            <Filter className="h-3 w-3" />
            Type
          </span>
          {(["all", "booking", "staff", "report", "service", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                typeFilter === t
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "all" ? "All" : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1 rounded-lg bg-card border border-border overflow-hidden">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              onClick={() => setSelectedNotification(notification)}
              className={cn(
                "cursor-pointer flex items-start gap-4 p-4 border-b border-border last:border-0 transition-colors hover:bg-accent/50",
                notification.unread ? "bg-primary/5" : "bg-transparent"
              )}
            >
              <div className="flex-shrink-0 pt-1">
                {notification.unread ? (
                  <div className="h-2 w-2 rounded-full bg-primary" aria-label="Unread" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30" aria-label="Read" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{notification.title}</p>
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted text-muted-foreground uppercase tracking-wider">
                    {TYPE_LABELS[notification.type]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {notification.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground/60">{notification.time}</span>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {notification.unread ? (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs font-medium text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        aria-label={`Mark ${notification.title} as read`}
                      >
                        Mark as read
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkAsUnread(notification.id)}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        aria-label={`Mark ${notification.title} as unread`}
                      >
                        Mark as unread
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <NotificationDetailDialog
          notification={selectedNotification}
          open={!!selectedNotification}
          onOpenChange={(open) => !open && setSelectedNotification(null)}
          onMarkAsRead={handleMarkAsRead}
        />

        {filteredNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              {filter === "unread" ? (
                <Bell className="h-6 w-6 text-muted-foreground/40" />
              ) : (
                <BellOff className="h-6 w-6 text-muted-foreground/40" />
              )}
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">No notifications found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter === "unread"
                ? "You have no unread notifications"
                : "Nothing matches your current filters"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}