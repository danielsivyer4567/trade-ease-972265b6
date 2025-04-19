import React, { useState, useRef, useEffect } from 'react';
import { X, Bell, PinIcon, Maximize2, Minimize2, ArrowLeftRight, Pin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';
import { useNotifications } from './NotificationContextProvider';

type PanelSize = 'quarter' | 'half' | 'custom';
type ActiveTab = 'all' | 'team' | 'trades' | 'account' | 'security';

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

  // Mock notification counts for tabs
  const notificationCounts = {
    all: 98,
    team: 5,
    trades: 9,
    account: 0,
    security: 0
  };

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

          {/* Filter Tabs with Notification Counts */}
          <div className="border-b">
            <div className="flex overflow-x-auto px-4 py-2 gap-2">
              <div className={cn(
                "relative flex items-center justify-center px-4 py-2 rounded-md cursor-pointer whitespace-nowrap",
                activeTab === 'all' ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
              )} onClick={() => setActiveTab('all')}>
                All Notifications
                {notificationCounts.all > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5">
                    {notificationCounts.all}
                  </span>
                )}
              </div>
              <div className={cn(
                "relative flex items-center justify-center px-4 py-2 rounded-md cursor-pointer whitespace-nowrap",
                activeTab === 'team' ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
              )} onClick={() => setActiveTab('team')}>
                Team Notifications
                {notificationCounts.team > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5">
                    {notificationCounts.team}
                  </span>
                )}
              </div>
              <div className={cn(
                "relative flex items-center justify-center px-4 py-2 rounded-md cursor-pointer whitespace-nowrap",
                activeTab === 'trades' ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
              )} onClick={() => setActiveTab('trades')}>
                Trades
                {notificationCounts.trades > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5">
                    {notificationCounts.trades}
                  </span>
                )}
              </div>
              <div className={cn(
                "relative flex items-center justify-center px-4 py-2 rounded-md cursor-pointer whitespace-nowrap",
                activeTab === 'account' ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
              )} onClick={() => setActiveTab('account')}>
                Account
              </div>
              <div className={cn(
                "relative flex items-center justify-center px-4 py-2 rounded-md cursor-pointer whitespace-nowrap",
                activeTab === 'security' ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
              )} onClick={() => setActiveTab('security')}>
                Security
              </div>
            </div>
          </div>

          {/* Activity Dashboard Section */}
          <div className="bg-gray-50 p-4 border-b">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Activity Dashboard</h3>
            <p className="text-xs text-gray-500">
              View and manage actions from all users. Click on any activity to dismiss or pin important notifications.
            </p>
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
            
            {/* Sample notification items based on the image with dismiss/pin options */}
            {activeTab === 'trades' && (
              <>
                <div className="p-4 hover:bg-gray-50 flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">job 550 - sally healer</h4>
                    </div>
                    <p className="text-green-500 font-medium">invoice paid</p>
                    <span className="text-xs text-gray-500">Jul 12, 10:15 AM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 font-medium">+$10,812.50</span>
                    <button className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">dismiss</button>
                    <button title="Pin this notification" className="text-gray-400 hover:text-blue-500">
                      <PinIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 hover:bg-gray-50 flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">job556 - greg hearn</h4>
                    </div>
                    <p className="text-green-500 font-medium">job completed by Jackson ryan</p>
                    <span className="text-xs text-gray-500">Jul 11, 04:45 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <img src="https://via.placeholder.com/40" alt="Completion" className="h-10 w-10 rounded object-cover" />
                      <img src="https://via.placeholder.com/40" alt="Completion" className="h-10 w-10 rounded object-cover" />
                      <img src="https://via.placeholder.com/40" alt="Completion" className="h-10 w-10 rounded object-cover" />
                    </div>
                    <button className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">dismiss</button>
                    <button title="Pin this notification" className="text-gray-400 hover:text-blue-500">
                      <PinIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 hover:bg-gray-50 flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">qt 998 - jess grean</h4>
                    </div>
                    <p className="text-green-500 font-medium">quote accepted</p>
                    <span className="text-xs text-gray-500">Jul 8, 03:30 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 font-medium">quote accepted</span>
                    <button className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">dismiss</button>
                    <button title="Pin this notification" className="text-gray-400 hover:text-blue-500">
                      <PinIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 hover:bg-gray-50 flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Qt 999 - mike fills</h4>
                    </div>
                    <p className="text-red-500 font-medium">quote denied</p>
                    <span className="text-xs text-gray-500">Jul 7, 10:20 AM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-medium">quote denied</span>
                    <button className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">dismiss</button>
                    <button title="Pin this notification" className="text-gray-400 hover:text-blue-500">
                      <PinIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 hover:bg-gray-50 flex items-start border-t">
                  <div className="flex-1">
                    <span className="text-xs text-gray-500">Jul 5, 09:30 AM</span>
                  </div>
                  <div>
                    <span className="text-green-500 font-medium">+$1,080.00</span>
                  </div>
                </div>
              </>
            )}
            
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