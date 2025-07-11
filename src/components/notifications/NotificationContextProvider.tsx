import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string | number;
  type: 'job' | 'quote' | 'payment' | 'message' | 'other' | 'tag' | 'comment' | 'team' | 'calendar' | 'account' | 'security';
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
  initials?: string;
  // Enhanced fields for tag/comment notifications
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  comment?: string;
  mediaType?: 'image' | 'drawing' | 'audio' | 'video';
  mediaUrl?: string;
  drawingData?: string;
  requiresApproval?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approverIds?: string[];
  conversationId?: string;
  replyCount?: number;
  coordinates?: { x: number; y: number };
  attachments?: Array<{
    type: 'image' | 'audio' | 'drawing';
    url: string;
  }>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isNotificationOpen: boolean;
  isDraggableNotificationOpen: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;
  toggleNotifications: () => void;
  openDraggableNotifications: () => void;
  closeDraggableNotifications: () => void;
  toggleDraggableNotifications: () => void;
  markAsRead: (id: string | number) => void;
  markAllAsRead: () => void;
  // New functions for enhanced notifications
  replyToNotification: (notificationId: string | number, reply: string, attachments?: any[]) => void;
  approveNotification: (notificationId: string | number, approverId: string) => void;
  rejectNotification: (notificationId: string | number, approverId: string, reason?: string) => void;
  getConversationNotifications: (conversationId: string) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock notifications - this would normally come from an API or database
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'tag',
    title: 'New Tag by Alice',
    description: 'Alice tagged you: "Check this section..."',
    time: '4m ago',
    read: false,
    link: '/customers/123',
    senderId: 'user_alice',
    senderName: 'Alice',
    senderAvatar: '/avatars/alice.jpg',
    comment: 'Check this section for the customer details. I think there might be an issue with the contact information.',
    coordinates: { x: 450, y: 300 },
    initials: 'A'
  },
  {
    id: '2',
    type: 'comment',
    title: 'Reply from Bob',
    description: 'Bob replied to your tag: "Good catch..."',
    time: '3m ago',
    read: false,
    link: '/customers/123',
    senderId: 'user_bob',
    senderName: 'Bob',
    senderAvatar: '/avatars/bob.jpg',
    comment: 'Good catch! I noticed the same issue. We should update the phone number format to match our standard.',
    coordinates: { x: 450, y: 300 },
    initials: 'B'
  },
  {
    id: '3',
    type: 'tag',
    title: 'Tag from John',
    description: 'John tagged you: "This button needs a different color..."',
    time: '2 hours ago',
    read: false,
    link: '/dashboard',
    senderId: 'user_john',
    senderName: 'John',
    senderAvatar: '/avatars/john.jpg',
    comment: 'This button needs a different color. @Alice Wonder - what do you think about making it blue instead of gray?',
    coordinates: { x: 330, y: 150 },
    initials: 'J'
  },
  {
    id: '4',
    type: 'comment',
    title: 'Reply from Sarah',
    description: 'Sarah replied to your tag: "I agree with the changes..."',
    time: '1 hour ago',
    read: false,
    link: '/dashboard',
    senderId: 'user_sarah',
    senderName: 'Sarah',
    senderAvatar: '/avatars/sarah.jpg',
    comment: 'I agree with the changes. The current placement looks too cramped.',
    coordinates: { x: 330, y: 150 },
    initials: 'S'
  },
  {
    id: '5',
    type: 'tag',
    title: 'Audio note from Mike',
    description: 'Mike left an audio note',
    time: '30 minutes ago',
    read: false,
    link: '/jobs/456',
    senderId: 'user_mike',
    senderName: 'Mike',
    senderAvatar: '/avatars/mike.jpg',
    comment: 'Quick audio note about the electrical work - check the wiring in this section.',
    mediaType: 'audio',
    mediaUrl: '/audio/mike_note.mp3',
    coordinates: { x: 600, y: 400 },
    initials: 'M'
  },
  {
    id: '6',
    type: 'team',
    title: 'Team Update',
    description: 'Weekly team meeting scheduled',
    time: '1 day ago',
    read: true,
    initials: 'TU'
  },
  {
    id: '5',
    type: 'tag',
    title: 'New tag from John',
    description: 'John tagged you in a comment',
    time: '2 hours ago',
    read: false,
    senderId: 'user_john',
    senderName: 'John Smith',
    senderAvatar: '/avatars/john.jpg',
    comment: 'Hey, can you review this electrical layout? I think we need to adjust the placement of the main panel.',
    mediaType: 'drawing',
    drawingData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    requiresApproval: true,
    approvalStatus: 'pending',
    approverIds: ['manager_1', 'supervisor_1'],
    conversationId: 'conv_1',
    replyCount: 0,
    coordinates: { x: 450, y: 300 },
    attachments: [{
      type: 'drawing',
      url: '/drawings/electrical_layout.png'
    }]
  },
  {
    id: '6',
    type: 'comment',
    title: 'Reply from Sarah',
    description: 'Sarah replied to your tag',
    time: '1 hour ago',
    read: false,
    senderId: 'user_sarah',
    senderName: 'Sarah Johnson',
    senderAvatar: '/avatars/sarah.jpg',
    comment: 'I agree with the changes. The current placement looks too cramped.',
    mediaType: 'image',
    mediaUrl: '/images/panel_photo.jpg',
    conversationId: 'conv_1',
    replyCount: 2,
    coordinates: { x: 450, y: 300 },
    attachments: [{
      type: 'image',
      url: '/images/panel_photo.jpg'
    }]
  },
  {
    id: '7',
    type: 'tag',
    title: 'Audio note from Mike',
    description: 'Mike left an audio note',
    time: '30 minutes ago',
    read: false,
    senderId: 'user_mike',
    senderName: 'Mike Davis',
    senderAvatar: '/avatars/mike.jpg',
    comment: 'Quick voice note about the plumbing changes we discussed',
    mediaType: 'audio',
    mediaUrl: '/audio/mike_note.mp3',
    conversationId: 'conv_2',
    replyCount: 0,
    coordinates: { x: 200, y: 150 },
    attachments: [{
      type: 'audio',
      url: '/audio/mike_note.mp3'
    }]
  }
];

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDraggableNotificationOpen, setIsDraggableNotificationOpen] = useState(false);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const openNotifications = () => {
    setIsNotificationOpen(true);
    setIsDraggableNotificationOpen(false);
  };
  
  const closeNotifications = () => setIsNotificationOpen(false);
  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (!isNotificationOpen) {
      setIsDraggableNotificationOpen(false);
    }
  };
  
  const openDraggableNotifications = () => {
    setIsDraggableNotificationOpen(true);
    setIsNotificationOpen(false);
  };
  
  const closeDraggableNotifications = () => setIsDraggableNotificationOpen(false);
  const toggleDraggableNotifications = () => {
    console.log('toggleDraggableNotifications called, current state:', isDraggableNotificationOpen);
    const newState = !isDraggableNotificationOpen;
    console.log('Setting isDraggableNotificationOpen to:', newState);
    setIsDraggableNotificationOpen(newState);
    if (!isDraggableNotificationOpen) {
      setIsNotificationOpen(false);
    }
  };
  
  const markAsRead = (id: string | number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // New functions for enhanced notifications
  const replyToNotification = (notificationId: string | number, reply: string, attachments?: any[]) => {
    // This would typically make an API call to save the reply
    // For now, we'll create a new notification as a reply
    const originalNotification = notifications.find(n => n.id === notificationId);
    if (!originalNotification) return;

    const newReply: Notification = {
      id: `reply_${Date.now()}`,
      type: 'comment',
      title: 'Your reply',
      description: reply,
      time: 'just now',
      read: true,
      senderId: 'current_user',
      senderName: 'You',
      comment: reply,
      conversationId: originalNotification.conversationId || `conv_${originalNotification.id}`,
      replyCount: 0,
      coordinates: originalNotification.coordinates,
      attachments: attachments || []
    };

    setNotifications(prev => {
      // Update reply count for the original notification
      const updatedNotifications = prev.map(n => {
        if (n.conversationId === newReply.conversationId) {
          return { ...n, replyCount: (n.replyCount || 0) + 1 };
        }
        return n;
      });
      return [newReply, ...updatedNotifications];
    });
  };

  const approveNotification = (notificationId: string | number, approverId: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === notificationId) {
        return { ...n, approvalStatus: 'approved' as const };
      }
      return n;
    }));
  };

  const rejectNotification = (notificationId: string | number, approverId: string, reason?: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === notificationId) {
        return { ...n, approvalStatus: 'rejected' as const };
      }
      return n;
    }));
  };

  const getConversationNotifications = (conversationId: string) => {
    return notifications.filter(n => n.conversationId === conversationId).sort((a, b) => {
      // Sort by time (newest first for display)
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });
  };

  // Close notifications when clicking escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeNotifications();
        closeDraggableNotifications();
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
      isDraggableNotificationOpen,
      openNotifications,
      closeNotifications,
      toggleNotifications,
      openDraggableNotifications,
      closeDraggableNotifications,
      toggleDraggableNotifications,
      markAsRead,
      markAllAsRead,
      replyToNotification,
      approveNotification,
      rejectNotification,
      getConversationNotifications,
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
