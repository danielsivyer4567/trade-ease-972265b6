
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Notification } from "@/pages/Notifications/types";
import { useNotificationPanelState, setNotificationPanelState } from "@/hooks/useNotificationPanelState";
import { NotificationPanel } from "./notification/NotificationPanel";

export { useNotificationPanelState, setNotificationPanelState };

export function NotificationButton() {
  const [open, setOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New job assigned",
      description: "You have been assigned to job #1234",
      date: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
      isCompleted: false,
      isSortedLater: false,
      isIncomplete: true
    }, 
    {
      id: 2,
      title: "Quote approved",
      description: "Customer approved quote for job #5678",
      date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      isCompleted: false,
      isSortedLater: false,
      isIncomplete: true
    }, 
    {
      id: 3,
      title: "Payment received",
      description: "Payment received for invoice #9012",
      date: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
      isCompleted: true,
      isSortedLater: false,
      isIncomplete: false
    }
  ]);

  // Update global state when local state changes
  useEffect(() => {
    setNotificationPanelState({
      isOpen: open,
      isPinned
    });
  }, [open, isPinned]);

  const handleComplete = (id: number) => {
    setNotifications(prev => prev.map(notification => notification.id === id ? {
      ...notification,
      isCompleted: !notification.isCompleted,
      isIncomplete: notification.isCompleted
    } : notification));
  };

  const handleSortLater = (id: number) => {
    setNotifications(prev => prev.map(notification => notification.id === id ? {
      ...notification,
      isSortedLater: !notification.isSortedLater
    } : notification));
  };

  const handleNotificationClick = (id: number) => {
    console.log("Notification clicked:", id);
    // Here you would navigate to the relevant section of the app
  };

  const handleTogglePin = () => {
    setIsPinned(!isPinned);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isPinned) {
      setOpen(newOpen);
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isCompleted && !n.isSortedLater).length;

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        className={cn(
          "rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 fixed bottom-6 right-6 flex items-center justify-center shadow-lg z-50", 
          isPinned && "opacity-0 pointer-events-none"
        )} 
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      <NotificationPanel
        open={open}
        isPinned={isPinned}
        notifications={notifications}
        onOpenChange={handleOpenChange}
        onTogglePin={handleTogglePin}
        onNotificationClick={handleNotificationClick}
      />
    </>
  );
}
