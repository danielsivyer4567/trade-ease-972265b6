
import React from 'react';
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';

interface NotificationItemProps {
  id: string | number;
  type: 'job' | 'quote' | 'payment' | 'message' | 'other';
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
  initials?: string;
}

export const NotificationItem = ({
  id,
  type,
  title,
  description,
  time,
  read,
  link,
  initials = "N"
}: NotificationItemProps) => {
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

  const Content = () => (
    <div className="flex items-start py-4 px-4 hover:bg-gray-50 transition-colors cursor-pointer relative">
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-medium", getBgColor())}>
        {getInitials()}
      </div>
      <div className="ml-3 flex-1">
        <h4 className="text-base font-medium">{title}</h4>
        <p className="text-gray-600">{description}</p>
        <p className="text-gray-500 text-sm mt-1">{time}</p>
      </div>
      {!read && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 h-2 w-2 rounded-full bg-blue-600" />
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
