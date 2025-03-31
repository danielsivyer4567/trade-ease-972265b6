
import React, { useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { NotificationCard } from "@/pages/Notifications/components/NotificationCard";
import { Notification } from "@/pages/Notifications/types";

export function NotificationButton() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New job request",
      description: "You have a new job request from client #1242",
      date: new Date().toISOString(),
      isCompleted: false,
      isSortedLater: false,
      isIncomplete: true
    },
    {
      id: 2,
      title: "Document approval",
      description: "Invoice #INV-2022-001 requires your approval",
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      isCompleted: false,
      isSortedLater: false,
      isIncomplete: true
    },
    {
      id: 3,
      title: "Quote accepted",
      description: "Client has accepted quote #QT-2022-035",
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      isCompleted: true,
      isSortedLater: false,
      isIncomplete: false
    }
  ]);

  const handleComplete = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { 
              ...notification, 
              isCompleted: !notification.isCompleted,
              isIncomplete: notification.isCompleted 
            } 
          : notification
      )
    );
  };

  const handleSortLater = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isSortedLater: !notification.isSortedLater } 
          : notification
      )
    );
  };

  const handleNotificationClick = (id: number) => {
    console.log("Notification clicked:", id);
    // Here you would navigate to the relevant section of the app
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isCompleted && !n.isSortedLater).length;

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 fixed bottom-6 right-6 flex items-center justify-center shadow-lg z-50"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Unread
                {unreadCount > 0 && (
                  <span className="ml-2 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="later" className="flex-1">Later</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="max-h-[60vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">No notifications</p>
              ) : (
                notifications.map(notification => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onComplete={handleComplete}
                    onSortLater={handleSortLater}
                    onNotificationClick={handleNotificationClick}
                  />
                ))
              )}
            </TabsContent>
            <TabsContent value="unread" className="max-h-[60vh] overflow-y-auto">
              {notifications.filter(n => !n.isCompleted && !n.isSortedLater).length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">No unread notifications</p>
              ) : (
                notifications
                  .filter(n => !n.isCompleted && !n.isSortedLater)
                  .map(notification => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onComplete={handleComplete}
                      onSortLater={handleSortLater}
                      onNotificationClick={handleNotificationClick}
                    />
                  ))
              )}
            </TabsContent>
            <TabsContent value="later" className="max-h-[60vh] overflow-y-auto">
              {notifications.filter(n => n.isSortedLater).length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">No notifications marked for later</p>
              ) : (
                notifications
                  .filter(n => n.isSortedLater)
                  .map(notification => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onComplete={handleComplete}
                      onSortLater={handleSortLater}
                      onNotificationClick={handleNotificationClick}
                    />
                  ))
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
