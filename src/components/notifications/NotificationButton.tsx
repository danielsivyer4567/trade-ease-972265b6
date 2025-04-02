
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from './NotificationContextProvider';
import { cn } from '@/lib/utils';

export const NotificationButton = () => {
  // Add error handling for when the NotificationProvider is not available
  try {
    const {
      unreadCount,
      toggleNotifications
    } = useNotifications();
    
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative h-12 w-12 md:h-15 md:w-15" 
        onClick={toggleNotifications} 
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        
        {unreadCount > 0 && (
          <span className={cn(
            "absolute top-1 right-1 h-6 w-6 text-xs flex items-center justify-center",
            "rounded-full bg-red-600 text-white font-bold",
            "transform translate-x-1 -translate-y-1"
          )}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
    );
  } catch (error) {
    // Provide a fallback when NotificationProvider is not available
    console.error('NotificationProvider not available:', error);
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="relative h-12 w-12 md:h-15 md:w-15" 
        aria-label="Notifications"
        disabled
      >
        <Bell className="h-6 w-6" />
      </Button>
    );
  }
};
