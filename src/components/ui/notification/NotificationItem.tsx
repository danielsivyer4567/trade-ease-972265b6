
import React from 'react';
import { Notification } from '@/pages/Notifications/types';
import { format } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  onClick: (id: number) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  // Helper function to get initials from notification title
  const getInitials = (title: string) => {
    const words = title.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return title.substring(0, 2).toUpperCase();
  };

  // Format time in a relative way
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
    <div 
      className="flex items-start gap-3 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 px-2"
      onClick={() => onClick(notification.id)}
    >
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
          {getInitials(notification.title)}
        </div>
      </div>
      <div className="flex-1">
        <div className="font-medium">{notification.title}</div>
        <p className="text-sm text-gray-600">{notification.description}</p>
        <div className="text-xs text-gray-500 mt-1">
          {formatTimeAgo(notification.date)}
        </div>
      </div>
      {!notification.isCompleted && (
        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2"></div>
      )}
    </div>
  );
}
