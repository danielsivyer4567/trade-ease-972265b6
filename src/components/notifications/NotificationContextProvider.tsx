
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Notification {
  id: string | number;
  type: 'job' | 'quote' | 'payment' | 'message' | 'other';
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
  initials?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isNotificationOpen: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;
  toggleNotifications: () => void;
  markAsRead: (id: string | number) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock notifications - this would normally come from an API or database
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'job',
    title: 'New job assigned',
    description: 'You have been assigned to job #1234',
    time: '6 hours ago',
    read: false,
    link: '/jobs/1234',
    initials: 'NJ'
  },
  {
    id: '2',
    type: 'quote',
    title: 'Quote approved',
    description: 'Customer approved quote for job #5678',
    time: '7 hours ago',
    read: false,
    link: '/quotes/5678',
    initials: 'QA'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment received',
    description: 'Payment received for invoice #9012',
    time: '9 hours ago',
    read: true,
    link: '/invoices/9012',
    initials: 'PR'
  },
  {
    id: '4',
    type: 'message',
    title: 'New message',
    description: 'Team leader sent you a message',
    time: '1 day ago',
    read: true,
    link: '/messaging',
    initials: 'TL'
  },
];

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const openNotifications = () => setIsNotificationOpen(true);
  const closeNotifications = () => setIsNotificationOpen(false);
  const toggleNotifications = () => setIsNotificationOpen(!isNotificationOpen);
  
  const markAsRead = (id: string | number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Close notifications when clicking escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeNotifications();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isNotificationOpen,
      openNotifications,
      closeNotifications,
      toggleNotifications,
      markAsRead,
      markAllAsRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};
