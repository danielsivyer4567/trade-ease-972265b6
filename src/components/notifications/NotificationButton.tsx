
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from './NotificationContextProvider';
import { cn } from '@/lib/utils';
export const NotificationButton = () => {
  const {
    unreadCount,
    toggleNotifications
  } = useNotifications();
  return <Button variant="ghost" size="icon" className="relative h-12 w-12 md:h-15 md:w-15" // Enlarged button size
  onClick={toggleNotifications} aria-label="Notifications">
      <Bell className="h-15 w-15 px-0 my-0 mx-0 py-0" /> {/* Enlarged bell icon (3x) */}
      
      {unreadCount > 0 && <span className={cn("absolute top-1 right-1 h-6 w-6 text-xs flex items-center justify-center", "rounded-full bg-red-600 text-white font-bold",
    // Changed to red
    "transform translate-x-1 -translate-y-1")}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>}
    </Button>;
};
