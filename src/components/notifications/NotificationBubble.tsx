import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useNotifications, type Notification } from './NotificationContextProvider';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Reply,
  Users,
  Image as ImageIcon,
  Brush,
  Mic,
  Volume2
} from 'lucide-react';

interface NotificationBubbleProps {
  notification: Notification;
  onReply?: (notificationId: string | number) => void;
  onOpenMedia?: (mediaUrl: string, mediaType: string) => void;
  className?: string;
}

export const NotificationBubble: React.FC<NotificationBubbleProps> = ({
  notification,
  onReply,
  onOpenMedia,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const bubbleRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>();

  const { approveNotification, rejectNotification, getConversationNotifications } = useNotifications();

  // Get conversation notifications for threading
  const conversationNotifications = notification.conversationId 
    ? getConversationNotifications(notification.conversationId)
    : [];

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    
    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    
    // Show tooltip after a short delay
    tooltipTimeoutRef.current = setTimeout(() => {
      const rect = bubbleRef.current?.getBoundingClientRect();
      if (rect) {
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });
        setShowTooltip(true);
      }
    }, 500);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    // Clear timeout and hide tooltip
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setShowTooltip(false);
  };

  const handleBubbleClick = () => {
    if (notification.mediaUrl || notification.drawingData) {
      const mediaUrl = notification.mediaUrl || notification.drawingData;
      const mediaType = notification.mediaType || 'image';
      onOpenMedia?.(mediaUrl!, mediaType);
    }
  };

  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReply?.(notification.id);
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    approveNotification(notification.id, 'current_user');
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    rejectNotification(notification.id, 'current_user');
  };

  const handleAudioPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getMediaIcon = () => {
    switch (notification.mediaType) {
      case 'image':
        return <ImageIcon className="h-3 w-3" />;
      case 'drawing':
        return <Brush className="h-3 w-3" />;
      case 'audio':
        return <Mic className="h-3 w-3" />;
      default:
        return <MessageCircle className="h-3 w-3" />;
    }
  };

  const getApprovalStatusColor = () => {
    switch (notification.approvalStatus) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getApprovalStatusIcon = () => {
    switch (notification.approvalStatus) {
      case 'approved':
        return <CheckCircle className="h-3 w-3 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-3 w-3 text-red-600" />;
      case 'pending':
        return <Clock className="h-3 w-3 text-yellow-600" />;
      default:
        return null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={bubbleRef}
        className={cn(
          "notification-bubble relative inline-block cursor-pointer transition-all duration-200",
          "hover:scale-110 hover:shadow-lg",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleBubbleClick}
      >
        {/* User Avatar */}
        <div className="relative">
          {notification.senderAvatar ? (
            <img
              src={notification.senderAvatar}
              alt={notification.senderName}
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm shadow-md">
              {notification.senderName?.charAt(0) || notification.initials || 'N'}
            </div>
          )}
          
          {/* Media indicator */}
          {notification.mediaType && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md border">
              {getMediaIcon()}
            </div>
          )}
          
          {/* Unread indicator */}
          {!notification.read && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          )}
          
          {/* Reply count */}
          {notification.replyCount! > 0 && (
            <div className="absolute -top-1 -left-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {notification.replyCount}
            </div>
          )}
        </div>

        {/* Approval Status */}
        {notification.requiresApproval && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            {getApprovalStatusIcon()}
          </div>
        )}

        {/* Hover overlay with reply button */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
            <Button
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 p-0"
              onClick={handleReplyClick}
            >
              <Reply className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Audio element for audio notifications */}
        {notification.mediaType === 'audio' && notification.mediaUrl && (
          <audio
            ref={audioRef}
            src={notification.mediaUrl}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="fixed z-[9999] max-w-xs bg-gray-900 text-white text-sm rounded-lg shadow-lg p-3 pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0">
              {notification.senderAvatar ? (
                <img
                  src={notification.senderAvatar}
                  alt={notification.senderName}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                  {notification.senderName?.charAt(0) || 'N'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-white">
                {notification.senderName || 'Unknown User'}
              </div>
              <div className="text-gray-300 text-xs mb-1">
                {notification.time}
              </div>
              {notification.comment && (
                <div className="text-gray-100 text-sm">
                  {notification.comment}
                </div>
              )}
              
              {/* Conversation count */}
              {conversationNotifications.length > 1 && (
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                  <Users className="h-3 w-3" />
                  {conversationNotifications.length} messages
                </div>
              )}
              
              {/* Approval actions */}
              {notification.requiresApproval && notification.approvalStatus === 'pending' && (
                <div className="flex gap-1 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs bg-green-600 hover:bg-green-700 border-green-600 text-white"
                    onClick={handleApprove}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-xs bg-red-600 hover:bg-red-700 border-red-600 text-white"
                    onClick={handleReject}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationBubble;