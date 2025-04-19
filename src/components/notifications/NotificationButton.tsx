import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from './NotificationContextProvider';
import { cn } from '@/lib/utils';

interface NotificationButtonProps {
  className?: string;
}

export const NotificationButton = ({ className }: NotificationButtonProps) => {
  const { 
    unreadCount, 
    toggleDraggableNotifications, 
    isDraggableNotificationOpen 
  } = useNotifications();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={cn("relative", className, isDraggableNotificationOpen && "text-primary bg-primary/10")} 
      onClick={toggleDraggableNotifications}
      aria-label={`${unreadCount} unread notifications`}
    >
      <Bell className="h-5 w-5" />
      
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Button>
  );
};
