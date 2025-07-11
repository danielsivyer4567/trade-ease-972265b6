import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import { useNotifications } from './NotificationContextProvider';
import { Check } from 'lucide-react';
import { NotificationBubble } from './NotificationBubble';
import { MediaViewer } from './MediaViewer';

interface NotificationItemProps {
  id: string | number;
  type: 'job' | 'quote' | 'payment' | 'message' | 'other' | 'tag' | 'comment' | 'team' | 'calendar' | 'account' | 'security';
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
  initials?: string;
  isPanelPinned?: boolean;
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
  // Add callback for reply functionality
  onReply?: (notificationId: string | number) => void;
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
  isPanelPinned = false,
  senderId,
  senderName,
  senderAvatar,
  comment,
  mediaType,
  mediaUrl,
  drawingData,
  requiresApproval,
  approvalStatus,
  approverIds,
  conversationId,
  replyCount,
  coordinates,
  attachments,
  onReply
}: NotificationItemProps) => {
  const { markAsRead } = useNotifications();
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [mediaViewerUrl, setMediaViewerUrl] = useState('');
  const [mediaViewerType, setMediaViewerType] = useState<'image' | 'drawing' | 'audio' | 'video'>('image');
  
  // Define background colors based on notification type
  const getBgColor = () => {
    switch (type) {
      case 'job':
        return 'bg-blue-500';
      case 'quote':
        return 'bg-green-500';
      case 'payment':
        return 'bg-emerald-500';
      case 'message':
        return 'bg-purple-500';
      case 'tag':
        return 'bg-blue-500';
      case 'comment':
        return 'bg-gray-500';
      case 'team':
        return 'bg-orange-500';
      case 'calendar':
        return 'bg-red-500';
      case 'account':
        return 'bg-blue-500';
      case 'security':
        return 'bg-red-600';
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

  const handleOpenMedia = (url: string, type: string) => {
    setMediaViewerUrl(url);
    setMediaViewerType(type as 'image' | 'drawing' | 'audio' | 'video');
    setShowMediaViewer(true);
  };

  const handleReply = (notificationId: string | number) => {
    onReply?.(notificationId);
  };

  const handleNotificationClick = () => {
    // Handle navigation to the tagged page location
    if (type === 'tag' || type === 'comment') {
      if (coordinates && link) {
        // Store the notification data for overlay display
        const tagData = {
          id,
          comment,
          senderName,
          senderAvatar,
          time,
          coordinates,
          mediaType,
          mediaUrl,
          drawingData,
          attachments
        };
        
        // Store in sessionStorage for retrieval on the target page
        sessionStorage.setItem('activeTagOverlay', JSON.stringify(tagData));
        
        // Navigate to the page
        window.location.href = link;
      }
    } else if (link) {
      // Regular navigation for non-tag notifications
      window.location.href = link;
    }
    
    // Mark as read
    if (!read) {
      markAsRead(id);
    }
  };

  // Check if this is a tag/comment notification that should show as a bubble
  const isTagOrComment = type === 'tag' || type === 'comment';
  const hasMedia = mediaType || mediaUrl || drawingData;

  // Create notification object for bubble
  const notificationData = {
    id,
    type,
    title,
    description,
    time,
    read,
    link,
    initials,
    senderId,
    senderName,
    senderAvatar,
    comment,
    mediaType,
    mediaUrl,
    drawingData,
    requiresApproval,
    approvalStatus,
    approverIds,
    conversationId,
    replyCount,
    coordinates,
    attachments
  };

  const Content = () => {
    // If it's a tag/comment notification, show as bubble
    if (isTagOrComment && (hasMedia || comment)) {
      return (
        <div className="flex items-start py-3 px-4 hover:bg-gray-50 transition-colors relative rounded-lg cursor-pointer" onClick={handleNotificationClick}>
          <div className="flex-shrink-0 mr-3">
            <NotificationBubble
              notification={notificationData}
              onReply={handleReply}
              onOpenMedia={handleOpenMedia}
              className="transform scale-90"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={cn("text-sm font-medium text-gray-900", read && "text-gray-500")}>{title}</h4>
            <p className="text-gray-600 text-sm truncate">{description}</p>
            <p className="text-gray-400 text-xs mt-1">{time}</p>
            {comment && (
              <p className="text-gray-700 text-sm mt-1 italic line-clamp-2">
                "{comment}"
              </p>
            )}
          </div>
          
          {!read && (
            <div className="flex items-center gap-2">
              {isPanelPinned && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(e);
                  }}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  title="Mark as read"
                >
                  <Check className="h-3 w-3 text-gray-600" />
                </button>
              )}
              <div className="h-2 w-2 rounded-full bg-blue-500" />
            </div>
          )}
        </div>
      );
    }

    // Default notification display
    return (
      <div className="flex items-start py-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer relative rounded-lg" onClick={handleNotificationClick}>
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm", getBgColor())}>
          {getInitials()}
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <h4 className={cn("text-sm font-medium text-gray-900", read && "text-gray-500")}>{title}</h4>
          <p className="text-gray-600 text-sm truncate">{description}</p>
          <p className="text-gray-400 text-xs mt-1">{time}</p>
        </div>
        
        {!read && (
          <div className="flex items-center gap-2">
            {isPanelPinned && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsRead(e);
                }}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                title="Mark as read"
              >
                <Check className="h-3 w-3 text-gray-600" />
              </button>
            )}
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          </div>
        )}
      </div>
    );
  };

  const WrapperComponent = () => {
    if (link && !isTagOrComment) {
      return (
        <Link to={link}>
          <Content />
        </Link>
      );
    }
    return <Content />;
  };

  return (
    <>
      <WrapperComponent />
      {showMediaViewer && (
        <MediaViewer
          isOpen={showMediaViewer}
          onClose={() => setShowMediaViewer(false)}
          mediaUrl={mediaViewerUrl}
          mediaType={mediaViewerType}
          title={title}
          description={comment || description}
        />
      )}
    </>
  );
};
