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
        currentUserId="demo-user-123"
        availableStaff={[
          { id: 'staff-1', name: 'Alice Johnson' },
          { id: 'staff-2', name: 'Bob Smith' },
          { id: 'staff-3', name: 'Carol Davis' },
          { id: 'staff-4', name: 'David Wilson' }
        ]}
        businessLogoUrl="/business-logo.png"
      />
    </>
  );
}; 