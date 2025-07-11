import React, { useState, useEffect, useRef } from 'react';
import { X, Reply, Users, Clock, Image as ImageIcon, Brush, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TagOverlayData {
  id: string | number;
  comment?: string;
  senderName?: string;
  senderAvatar?: string;
  time?: string;
  coordinates?: { x: number; y: number };
  mediaType?: 'image' | 'drawing' | 'audio' | 'video';
  mediaUrl?: string;
  drawingData?: string;
  attachments?: Array<{
    type: 'image' | 'audio' | 'drawing';
    url: string;
  }>;
}

interface TagOverlayProps {
  onClose?: () => void;
  onReply?: (tagId: string | number) => void;
}

export const TagOverlay: React.FC<TagOverlayProps> = ({ onClose, onReply }) => {
  const [tagData, setTagData] = useState<TagOverlayData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [adjustedCoords, setAdjustedCoords] = useState<{x: number, y: number} | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for active tag overlay data in sessionStorage
    const storedData = sessionStorage.getItem('activeTagOverlay');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setTagData(parsedData);
        
        // Adjust coordinates to ensure they're within viewport
        if (parsedData.coordinates) {
          const adjustedX = Math.max(60, Math.min(window.innerWidth - 60, parsedData.coordinates.x));
          const adjustedY = Math.max(60, Math.min(window.innerHeight - 200, parsedData.coordinates.y));
          setAdjustedCoords({ x: adjustedX, y: adjustedY });
        }
        
        setIsVisible(true);
        
        // Clean up the session storage
        sessionStorage.removeItem('activeTagOverlay');
      } catch (error) {
        console.error('Error parsing tag overlay data:', error);
      }
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleReply = () => {
    if (tagData) {
      onReply?.(tagData.id);
    }
  };

  const getMediaIcon = () => {
    switch (tagData?.mediaType) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'drawing':
        return <Brush className="h-4 w-4" />;
      case 'audio':
        return <Mic className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (!isVisible || !tagData || !adjustedCoords) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop with subtle overlay */}
      <div className="absolute inset-0 bg-black/10 pointer-events-auto" onClick={handleClose} />
      
      {/* Tag Bubble */}
      <div
        ref={overlayRef}
        className="absolute pointer-events-auto"
        style={{
          left: `${adjustedCoords.x}px`,
          top: `${adjustedCoords.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Pulsing indicator */}
        <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-30" />
        
        {/* Avatar bubble */}
        <div className="relative">
          {tagData.senderAvatar ? (
            <img
              src={tagData.senderAvatar}
              alt={tagData.senderName}
              className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg shadow-lg border-3 border-white">
              {tagData.senderName?.charAt(0) || 'T'}
            </div>
          )}
          
          {/* Media indicator */}
          {tagData.mediaType && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
              {getMediaIcon()}
            </div>
          )}
        </div>
        
        {/* Comment tooltip */}
        {tagData.comment && (
          <div className="absolute left-1/2 top-full mt-2 transform -translate-x-1/2 max-w-xs">
            <div className="bg-gray-900 text-white text-sm rounded-lg shadow-xl p-3 relative">
              {/* Arrow pointing up */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900" />
              </div>
              
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {tagData.senderAvatar ? (
                    <img
                      src={tagData.senderAvatar}
                      alt={tagData.senderName}
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                      {tagData.senderName?.charAt(0) || 'T'}
                    </div>
                  )}
                  <span className="font-medium text-white">{tagData.senderName || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">{tagData.time}</span>
                </div>
              </div>
              
              {/* Comment text */}
              <p className="text-gray-100 text-sm mb-3">{tagData.comment}</p>
              
              {/* Actions */}
              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReply}
                  className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white h-7 text-xs"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleClose}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 h-7 w-7 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagOverlay;