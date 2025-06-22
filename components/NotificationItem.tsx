
import React from 'react';
import { Bell, MessageSquare, Tag as TagIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import { Notification, cn } from '../types';

interface NotificationItemProps extends Notification {
  onClick?: (tagId?: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  type,
  title,
  message,
  timestamp,
  read,
  tagId,
  onClick,
}) => {
  const Icon = type === 'new_tag' || type === 'mention' ? TagIcon :
               type === 'reply' ? MessageSquare :
               Bell;

  const timeAgo = (date: number) => {
    const seconds = Math.floor((new Date().getTime() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick(tagId);
    }
  };

  return (
    <div
      className={cn(
        "p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors duration-150 ease-in-out cursor-pointer border-b border-gray-100",
        read ? "opacity-70" : "bg-blue-50/50"
      )}
      onClick={handleClick}
    >
      {!read && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
      <div className={`p-2 rounded-full ${ read ? 'bg-gray-100' : 'bg-blue-100'}`}>
         <Icon className={`h-5 w-5 ${ read ? 'text-gray-500' : 'text-blue-600'}`} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
          <span className="text-xs text-gray-400">{timeAgo(timestamp)}</span>
        </div>
        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export default NotificationItem;