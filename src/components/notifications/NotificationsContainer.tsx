import React from 'react';
import { useNotifications } from './NotificationContextProvider';
import { NotificationButton } from './NotificationButton';
import { DraggableNotificationsPanel } from './DraggableNotificationsPanel';

export const NotificationsContainer = () => {
  const { 
    isDraggableNotificationOpen, 
    closeDraggableNotifications 
  } = useNotifications();

  return (
    <>
      <NotificationButton className="h-10 w-10" />
      
      <DraggableNotificationsPanel 
        isOpen={isDraggableNotificationOpen}
        onClose={closeDraggableNotifications}
      />
    </>
  );
}; 