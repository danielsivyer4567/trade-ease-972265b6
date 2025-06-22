
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { Notification, NotificationsContextType } from '../types';

const NotificationContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Initialize with some mock notifications
    return [
      { id: 'notif_1', type: 'new_tag', title: 'New Tag by Alice', message: 'Alice tagged you: "Check this section..."', timestamp: Date.now() - 100000, read: false, tagId: 'tag_example_1' },
      { id: 'notif_2', type: 'reply', title: 'Reply from Bob', message: 'Bob replied to your tag: "Good catch..."', timestamp: Date.now() - 50000, read: true, tagId: 'tag_example_1' },
      { id: 'notif_3', type: 'mention', title: 'You were mentioned', message: 'Charlie mentioned you in a comment.', timestamp: Date.now() - 200000, read: false },
    ];
  });

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}`,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);
  
  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, markAllAsRead, getUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};