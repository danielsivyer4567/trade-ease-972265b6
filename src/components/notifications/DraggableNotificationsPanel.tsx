import React, { useState, useRef, useEffect } from 'react';
import { X, Bell, PinIcon, Maximize2, Minimize2, ArrowLeftRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';
import { useNotifications } from './NotificationContextProvider';

type PanelSize = 'quarter' | 'half' | 'custom';
type ActiveTab = 'all' | 'team';

interface DraggableNotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DraggableNotificationsPanel = ({
  isOpen,
  onClose
}: DraggableNotificationsPanelProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [panelSize, setPanelSize] = useState<PanelSize>('quarter');
  const [isPinned, setIsPinned] = useState(false);
  const [customWidth, setCustomWidth] = useState(350); // Default width in pixels
  const panelRef = useRef<HTMLDivElement>(null);
  const leftResizeHandleRef = useRef<HTMLDivElement>(null);
  const { notifications, markAllAsRead } = useNotifications();

  // Dynamic size based on panel size state
  const getPanelWidth = () => {
    if (panelSize === 'quarter') return '25vw';
    if (panelSize === 'half') return '50vw';
    return `${customWidth}px`;
  };

  // Resize functionality
  useEffect(() => {
    const leftResizeHandle = leftResizeHandleRef.current;
    const panel = panelRef.current;
    if (!leftResizeHandle || !panel) return;

    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    const onMouseDown = (e: MouseEvent) => {
      isResizing = true;
      startX = e.clientX;
      startWidth = panel.offsetWidth;
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const deltaX = startX - e.clientX;
      const newWidth = Math.max(300, startWidth + deltaX); // Ensure minimum width of 300px
      setCustomWidth(newWidth);
      setPanelSize('custom');
    };

    const onMouseUp = () => {
      isResizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    leftResizeHandle.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      leftResizeHandle.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Switch to team notifications - makes panel half size
  useEffect(() => {
    if (activeTab === 'team' && panelSize === 'quarter') {
      setPanelSize('half');
    }
  }, [activeTab, panelSize]);

  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  const togglePanelSize = () => {
    if (panelSize === 'quarter') {
      setPanelSize('half');
    } else if (panelSize === 'half') {
      setPanelSize('quarter');
    } else {
      // If custom, go to quarter
      setPanelSize('quarter');
    }
  };

  // Hide overlay when pinned
  const showOverlay = isOpen && !isPinned;

  return (
    <>
      {/* Overlay - only shown when not pinned */}
      {showOverlay && (
        <div 
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={isPinned ? undefined : onClose} 
          aria-hidden="true" 
        />
      )}

      {/* Notifications Panel */}
      <div 
        ref={panelRef}
        className={cn(
          "fixed right-0 top-0 h-screen bg-white z-50 shadow-lg transform transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          isPinned ? "border-l border-gray-200" : ""
        )}
        style={{ width: getPanelWidth() }}
      >
        {/* Left Resize Handle */}
        <div 
          ref={leftResizeHandleRef}
          className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize z-50 hover:bg-blue-400 hover:w-1.5 transition-all"
          aria-label="Drag to resize"
        />

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={togglePin} 
                aria-label={isPinned ? "Unpin panel" : "Pin panel"}
                title={isPinned ? "Unpin panel (allows closing)" : "Pin panel (stay open while working)"}
              >
                <PinIcon className={cn("h-4 w-4", isPinned && "text-blue-500 fill-blue-500")} />
              </Button>
              <Button variant="outline" size="icon" onClick={togglePanelSize} aria-label="Resize panel">
                {panelSize === 'quarter' ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={markAllAsRead} aria-label="Mark all as read">
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1 mx-4 my-3">
            <button 
              className={cn("flex-1 text-center py-2 rounded-md transition-all", activeTab === 'all' ? "bg-white shadow" : "hover:bg-gray-200")} 
              onClick={() => setActiveTab('all')}
            >
              All Notifications
            </button>
            <button 
              className={cn("flex-1 text-center py-2 rounded-md transition-all", activeTab === 'team' ? "bg-white shadow" : "hover:bg-gray-200")} 
              onClick={() => setActiveTab('team')}
            >
              Team Notifications
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto divide-y">
            {activeTab === 'all' && notifications.length > 0 && 
              notifications.map(notification => 
                <NotificationItem 
                  key={notification.id} 
                  {...notification} 
                  isPanelPinned={isPinned}
                />
              )
            }
            
            {activeTab === 'all' && notifications.length === 0 && 
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
                <Bell className="h-12 w-12 mb-4 opacity-20" />
                <p className="mb-2">No notifications yet</p>
                <p className="text-sm">New notifications will appear here</p>
              </div>
            }
            
            {activeTab === 'team' && 
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
                <Bell className="h-12 w-12 mb-4 opacity-20" />
                <p className="mb-2">No team notifications yet</p>
                <p className="text-sm">Team notifications will appear here when available</p>
              </div>
            }
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link to="/notifications" className="text-blue-500 text-center block w-full hover:underline" onClick={isPinned ? undefined : onClose}>
              View all notifications
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}; 