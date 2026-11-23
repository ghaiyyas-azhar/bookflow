"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react";
import { cn } from "@/lib/utils";
import { X, Calendar, User, Scissors, BarChart3, AlertCircle } from "lucide-react";
import { type Notification } from "@/types";

interface NotificationDetailDialogProps {
  notification: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkAsRead: (id: string) => void;
}

export function NotificationDetailDialog({
  notification,
  open,
  onOpenChange,
  onMarkAsRead,
}: NotificationDetailDialogProps) {
  React.useEffect(() => {
    if (open && notification && notification.unread) {
      onMarkAsRead(notification.id);
    }
  }, [open, notification, onMarkAsRead]);

  if (!notification) return null;

  const TypeIcon = {
    booking: Calendar,
    staff: User,
    report: BarChart3,
    service: Scissors,
    system: AlertCircle,
  }[notification.type];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-starting-style:opacity-0 data-ending-style:opacity-0 transition-opacity duration-300"
        />
        <Dialog.Popup
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4",
            "data-starting-style:opacity-0 data-starting-style:scale-95",
            "data-ending-style:opacity-0 data-ending-style:scale-95",
            "transition-all duration-300 ease-out"
          )}
        >
          <div className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-popover overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <TypeIcon className="h-5 w-5" />
                </div>
                <Dialog.Title className="text-lg font-semibold text-foreground">
                  {notification.title}
                </Dialog.Title>
              </div>
              <Dialog.Close className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>

            <div className="px-6 py-6 space-y-6">
              <Dialog.Description className="text-sm text-muted-foreground leading-relaxed">
                {notification.description}
              </Dialog.Description>

              {notification.details && (
                <div className="space-y-3 rounded-lg bg-muted p-4">
                  {notification.details.map((detail, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{detail.label}</span>
                      <span className="font-medium text-foreground">{detail.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notification.action && (
              <div className="px-6 py-4 border-t border-border flex justify-end">
                <a
                  href={notification.action.href}
                  onClick={() => onOpenChange(false)}
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  {notification.action.label}
                </a>
              </div>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
