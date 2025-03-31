
import React, { useState, useEffect } from "react";
import { Bell, X, Check, Clock, Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "./sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Notification } from "@/pages/Notifications/types";
import { format } from "date-fns";

// Create a global state system for the notification panel state
type NotificationPanelState = {
  isOpen: boolean;
  isPinned: boolean;
};

let listeners: ((state: NotificationPanelState) => void)[] = [];
let currentState: NotificationPanelState = {
  isOpen: false,
  isPinned: false
};

const notifyListeners = () => {
  listeners.forEach(listener => listener({...currentState}));
};

export const useNotificationPanelState = () => {
  const [state, setState] = useState(currentState);
  
  useEffect(() => {
    const listener = (newState: NotificationPanelState) => {
      setState({...newState});
    };
    
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }, []);
  
  return state;
};

export const setNotificationPanelState = (newState: Partial<NotificationPanelState>) => {
  currentState = {...currentState, ...newState};
  notifyListeners();
};

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
    setNotificationPanelState({ isOpen: open, isPinned });
  }, [open, isPinned]);

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

  const getInitials = (title: string) => {
    const words = title.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return title.substring(0, 2).toUpperCase();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

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

      <Sheet open={open || isPinned} onOpenChange={handleOpenChange}>
        <SheetContent 
          side="right" 
          className={cn(
            "sm:max-w-md w-[92vw] sm:w-[400px] p-0 transition-all duration-300",
            isPinned && "border-l-2 border-blue-500"
          )}
        >
          <div className="h-full flex flex-col">
            <SheetHeader className="px-6 pt-6 pb-2 border-b">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-xl">Notifications</SheetTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleTogglePin} 
                    className="rounded-full h-8 w-8 flex items-center justify-center"
                    title={isPinned ? "Unpin notifications" : "Pin notifications"}
                  >
                    {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  </Button>
                  {!isPinned && (
                    <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center">
                      <X className="h-4 w-4" />
                    </SheetClose>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Recent updates and messages</p>
            </SheetHeader>

            <Tabs defaultValue="all" className="flex-1 flex flex-col">
              <div className="px-4 pt-2">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="all" className="rounded-md">All Notifications</TabsTrigger>
                  <TabsTrigger value="team" className="rounded-md">Team Notifications</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto px-4">
                <TabsContent value="all" className="mt-0 space-y-4">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id}
                      className="flex items-start gap-3 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 px-2"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                          {getInitials(notification.title)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{notification.title}</div>
                        <p className="text-sm text-gray-600">{notification.description}</p>
                        <div className="text-xs text-gray-500 mt-1">{formatTimeAgo(notification.date)}</div>
                      </div>
                      {!notification.isCompleted && (
                        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  ))}
                  
                  <div className="flex justify-center pt-2 pb-6">
                    <Button 
                      variant="ghost" 
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    >
                      View all notifications
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="team" className="mt-0">
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No team notifications yet</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
