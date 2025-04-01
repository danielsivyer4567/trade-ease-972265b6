
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from './NotificationContextProvider';
import { cn } from '@/lib/utils';

export const NotificationButton = () => {
  const { unreadCount, toggleNotifications } = useNotifications();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={toggleNotifications}
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
      
      {unreadCount > 0 && (
        <span className={cn(
          "absolute top-1 right-1 h-4 w-4 text-xs flex items-center justify-center",
          "rounded-full bg-blue-600 text-white font-bold",
          "transform translate-x-1 -translate-y-1"
        )}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
};
