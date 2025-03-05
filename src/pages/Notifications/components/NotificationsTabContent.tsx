
import React from 'react';
import { NotificationCard } from './NotificationCard';
import { Notification } from '../types';

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
  return (
    <>
      {notifications.map(notification => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onComplete={onComplete}
          onSortLater={onSortLater}
          onNotificationClick={onNotificationClick}
        />
      ))}
    </>
  );
};
