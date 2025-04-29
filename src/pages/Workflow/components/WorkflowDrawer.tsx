import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Pin, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface WorkflowDrawerProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  defaultWidth?: number;
}

export function WorkflowDrawer({
  title,
  isOpen,
  onClose,
  children,
  defaultWidth = 400
}: WorkflowDrawerProps) {
  const [isPinned, setIsPinned] = useState(false);
  const [width, setWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number>(0);
  const dragStartWidth = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartWidth.current = width;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = dragStartX.current - e.clientX;
      const newWidth = Math.max(300, Math.min(800, dragStartWidth.current + deltaX));
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={drawerRef}
      className={cn(
        "fixed right-0 top-0 h-screen bg-white shadow-lg z-50 flex flex-col",
        isDragging && "select-none"
      )}
      style={{ width: `${width}px` }}
    >
      <div
        className="absolute left-0 top-0 w-1 h-full cursor-ew-resize"
        onMouseDown={handleMouseDown}
      />
      
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPinned(!isPinned)}
            className={cn(isPinned && "text-blue-600")}
          >
            <Pin className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => !isPinned && onClose()}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
} 