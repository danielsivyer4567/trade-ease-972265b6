import React from 'react';
import { NotificationCard } from './NotificationCard';
import { Notification } from '../types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BellOff } from 'lucide-react';

interface NotificationsTabContentProps {
  notifications: Notification[];
  onComplete: (id: number) => void;
  onSortLater: (id: number) => void;
  onNotificationClick: (id: number) => void;
}

export const NotificationsTabContent = ({
  notifications,
  onComplete,
  onSortLater,
  onNotificationClick,
}: NotificationsTabContentProps) => {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BellOff className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-1">No notifications</h3>
        <p className="text-sm text-muted-foreground/70">
          When you receive notifications, they will appear here
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
      <div className="space-y-2">
        {notifications.map(notification => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onComplete={onComplete}
            onSortLater={onSortLater}
            onNotificationClick={onNotificationClick}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
