import React from 'react';
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import { useNotifications } from './NotificationContextProvider';
import { Check } from 'lucide-react';

interface NotificationItemProps {
  id: string | number;
  type: 'job' | 'quote' | 'payment' | 'message' | 'other';
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
  initials?: string;
  isPanelPinned?: boolean;
}

export const NotificationItem = ({
  id,
  type,
  title,
  description,
  time,
  read,
  link,
  initials = "N",
  isPanelPinned = false
}: NotificationItemProps) => {
  const { markAsRead } = useNotifications();
  
  // Define background colors based on notification type
  const getBgColor = () => {
    switch (type) {
      case 'job':
        return 'bg-blue-500';
      case 'quote':
        return 'bg-blue-500';
      case 'payment':
        return 'bg-blue-500';
      case 'message':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get initials based on type if not provided
  const getInitials = () => {
    if (initials) return initials;
    
    switch (type) {
      case 'job':
        return 'NJ';
      case 'quote':
        return 'QA';
      case 'payment':
        return 'PR';
      case 'message':
        return 'MS';
      default:
        return 'NT';
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    if (!read) {
      e.preventDefault();
      e.stopPropagation();
      markAsRead(id);
    }
  };

  const Content = () => (
    <div className="flex items-start py-4 px-4 hover:bg-gray-50 transition-colors cursor-pointer relative">
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-medium", getBgColor())}>
        {getInitials()}
      </div>
      <div className="ml-3 flex-1">
        <h4 className={cn("text-base font-medium", read && "text-gray-500")}>{title}</h4>
        <p className="text-gray-600">{description}</p>
        <p className="text-gray-500 text-sm mt-1">{time}</p>
      </div>
      
      {!read && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center gap-2">
          {isPanelPinned && (
            <button 
              onClick={handleMarkAsRead}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Mark as read"
            >
              <Check className="h-4 w-4 text-gray-600" />
            </button>
          )}
          <div className="h-2 w-2 rounded-full bg-blue-600" />
        </div>
      )}
    </div>
  );

  if (link) {
    return (
      <Link to={link}>
        <Content />
      </Link>
    );
  }

  return <Content />;
};
