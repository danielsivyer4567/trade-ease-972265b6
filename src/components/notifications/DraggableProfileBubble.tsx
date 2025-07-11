import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from '@supabase/supabase-js';

interface DraggableProfileBubbleProps {
  user: User | null;
  isActive: boolean;
  onDragEnd: (x: number, y: number) => void;
  onDragStart?: () => void;
  onDragCancel?: () => void;
  className?: string;
}

export const DraggableProfileBubble: React.FC<DraggableProfileBubbleProps> = ({
  user,
  isActive,
  onDragEnd,
  onDragStart,
  onDragCancel,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState<{ x: number; y: number } | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const bubbleRef = useRef<HTMLDivElement>(null);

  // Get user avatar URL or fallback to initials
  const getAvatarUrl = () => {
    return user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
  };

  const getUserInitials = () => {
    if (!user) return '?';
    const email = user.email || '';
    const name = user.user_metadata?.full_name || user.user_metadata?.name || email;
    
    if (name && name !== email) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.charAt(0).toUpperCase();
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isActive) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = bubbleRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startPos = {
      x: e.clientX,
      y: e.clientY
    };

    setStartPosition(startPos);
    setCurrentPosition(startPos);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left - rect.width / 2,
      y: e.clientY - rect.top - rect.height / 2
    });

    onDragStart?.();
  }, [isActive, onDragStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !startPosition) return;
    
    e.preventDefault();
    
    setCurrentPosition({
      x: e.clientX,
      y: e.clientY
    });
  }, [isDragging, startPosition]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isDragging || !startPosition) return;
    
    e.preventDefault();
    
    const dragDistance = Math.sqrt(
      Math.pow(e.clientX - startPosition.x, 2) + 
      Math.pow(e.clientY - startPosition.y, 2)
    );
    
    // Only trigger tag drop if dragged at least 10 pixels
    if (dragDistance > 10) {
      onDragEnd(e.clientX - dragOffset.x, e.clientY - dragOffset.y);
    } else {
      onDragCancel?.();
    }
    
    setIsDragging(false);
    setStartPosition(null);
    setCurrentPosition(null);
  }, [isDragging, startPosition, dragOffset, onDragEnd, onDragCancel]);

  // Set up global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Calculate bubble position during drag
  const getBubbleStyle = () => {
    if (!currentPosition || !startPosition) return {};
    
    return {
      transform: `translate(${currentPosition.x - startPosition.x}px, ${currentPosition.y - startPosition.y}px)`,
      zIndex: isDragging ? 9999 : 'auto'
    };
  };

  if (!isActive) return null;

  return (
    <div
      ref={bubbleRef}
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-200 select-none",
        isDragging ? "scale-110 shadow-2xl" : "scale-100 hover:scale-105 shadow-lg",
        "cursor-grab active:cursor-grabbing",
        className
      )}
      style={getBubbleStyle()}
      onMouseDown={handleMouseDown}
    >
      <div className={cn(
        "relative p-2 bg-white rounded-full border-2 transition-all duration-200",
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
      )}>
        <Avatar className="w-12 h-12">
          <AvatarImage src={getAvatarUrl() || undefined} alt="Your profile" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        
        {/* Drag indicator */}
        <div className={cn(
          "absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white transition-all duration-200",
          isDragging ? "animate-pulse" : "animate-bounce"
        )}>
          <div className="w-full h-full bg-blue-500 rounded-full opacity-75"></div>
        </div>
        
        {/* Drag trail effect */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
        )}
      </div>
      
      {/* Tooltip */}
      {!isDragging && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Drag to place tag
        </div>
      )}
    </div>
  );
};