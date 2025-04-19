import React, { useState, useRef, useEffect } from 'react';
import { X, Bell, PinIcon, Maximize2, Minimize2, ArrowLeftRight, Pin, Calendar, MessageSquare, Tag, Edit3, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';
import { useNotifications } from './NotificationContextProvider';

type PanelSize = 'quarter' | 'half' | 'custom' | 'minimized';
type ActiveTab = 'all' | 'team' | 'trades' | 'account' | 'security' | 'calendar' | 'comments';

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
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [sortLater, setSortLater] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const leftResizeHandleRef = useRef<HTMLDivElement>(null);
  const { notifications, markAllAsRead } = useNotifications();

  // Calculate right sidebar width (assuming it's 50px)
  const SIDEBAR_WIDTH = 50;

  // Dynamic size based on panel size state
  const getPanelWidth = () => {
    if (panelSize === 'minimized') return '60px';
    if (panelSize === 'quarter') return `calc(25vw - ${SIDEBAR_WIDTH}px)`;
    if (panelSize === 'half') return `calc(50vw - ${SIDEBAR_WIDTH}px)`;
    return `${customWidth}px`;
  };

  // Adjust main content layout when the panel is open/pinned
  useEffect(() => {
    const adjustLayoutWithPanel = () => {
      // Get all elements with main content, maps, buttons, etc.
      const mainElements = document.querySelectorAll('.main-content, .map-container, .button-container');
      const rightSidebar = document.querySelector('.right-sidebar');
      
      if (!rightSidebar) {
        console.warn('Right sidebar not found');
      }
      
      // Right sidebar width plus some padding
      const sidebarWidth = rightSidebar ? rightSidebar.getBoundingClientRect().width : SIDEBAR_WIDTH;
      
      // Calculate panel width
      const panelWidth = isPinned && isOpen ? 
        (panelSize === 'minimized' ? 60 : 
         panelSize === 'quarter' ? Math.min(window.innerWidth * 0.25, window.innerWidth - sidebarWidth) : 
         panelSize === 'half' ? Math.min(window.innerWidth * 0.5, window.innerWidth - sidebarWidth) : 
         Math.min(customWidth, window.innerWidth - sidebarWidth)) : 0;
      
      // Add right margin to main content to make room for the panel plus sidebar
      const totalRightMargin = panelWidth + sidebarWidth;
      
      mainElements.forEach(element => {
        if (element instanceof HTMLElement) {
          if (isPinned && isOpen) {
            element.style.width = `calc(100% - ${totalRightMargin}px)`;
            element.style.marginRight = `${totalRightMargin}px`;
            element.style.transition = 'width 0.3s ease, margin-right 0.3s ease';
          } else {
            element.style.width = `calc(100% - ${sidebarWidth}px)`;
            element.style.marginRight = `${sidebarWidth}px`;
          }
        }
      });
    };

    // Call the adjustment function
    adjustLayoutWithPanel();
    
    // Listen for window resize to readjust
    window.addEventListener('resize', adjustLayoutWithPanel);
    
    return () => {
      window.removeEventListener('resize', adjustLayoutWithPanel);
      
      // Reset styles when component unmounts
      const mainElements = document.querySelectorAll('.main-content, .map-container, .button-container');
      const rightSidebar = document.querySelector('.right-sidebar');
      const sidebarWidth = rightSidebar ? rightSidebar.getBoundingClientRect().width : SIDEBAR_WIDTH;
      
      mainElements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.width = `calc(100% - ${sidebarWidth}px)`;
          element.style.marginRight = `${sidebarWidth}px`;
        }
      });
    };
  }, [isPinned, isOpen, panelSize, customWidth]);

  // Initialize layout on component mount
  useEffect(() => {
    // Add classes to main elements for easier selection
    const addClasses = () => {
      // Add to map container
      const mapContainer = document.querySelector('#map-container') || 
                           document.querySelector('.map-view') ||
                           document.querySelector('.leaflet-container');
      if (mapContainer) {
        mapContainer.classList.add('map-container');
      }
      
      // Add to main content
      const mainContent = document.querySelector('#main-content') || 
                         document.querySelector('main') ||
                         document.querySelector('.main-app-content');
      if (mainContent) {
        mainContent.classList.add('main-content');
      }
      
      // Add to button containers
      const buttonContainers = document.querySelectorAll('.button-row, .controls, .map-controls');
      buttonContainers.forEach(container => {
        container.classList.add('button-container');
      });
      
      // Identify right sidebar
      const rightSidebar = document.querySelector('.sidebar-right') || 
                          document.querySelector('.controls-right') ||
                          document.querySelector('.right-controls');
      if (rightSidebar) {
        rightSidebar.classList.add('right-sidebar');
      }
    };
    
    // Run initialization
    addClasses();
    
    // Set initial right margin for all content
    const mainElements = document.querySelectorAll('.main-content, .map-container, .button-container');
    mainElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.width = `calc(100% - ${SIDEBAR_WIDTH}px)`;
        element.style.marginRight = `${SIDEBAR_WIDTH}px`;
      }
    });
  }, []);

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
      
      // Calculate max width considering the sidebar
      const maxWidth = window.innerWidth - SIDEBAR_WIDTH;
      
      // Ensure minimum width of 300px and maximum that doesn't overlap sidebar
      const newWidth = Math.min(Math.max(300, startWidth + deltaX), maxWidth - 20);
      
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
    if (panelSize === 'minimized') {
      setPanelSize('quarter');
    } else if (panelSize === 'quarter') {
      setPanelSize('half');
    } else if (panelSize === 'half') {
      setPanelSize('quarter');
    } else {
      // If custom, go to quarter
      setPanelSize('quarter');
    }
  };

  const minimizePanel = () => {
    setPanelSize('minimized');
  };

  const addToSortLater = (id: string) => {
    setSortLater(prev => [...prev, id]);
  };

  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
  };

  // Hide overlay when pinned
  const showOverlay = isOpen && !isPinned;

  // Mock notification counts for tabs
  const notificationCounts = {
    all: 98,
    team: 5,
    trades: 9,
    calendar: 3,
    comments: 6,
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
        {/* Left Resize Handle - only show when not minimized */}
        {panelSize !== 'minimized' && (
          <div 
            ref={leftResizeHandleRef}
            className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize z-50 hover:bg-blue-400 hover:w-1.5 transition-all"
            aria-label="Drag to resize"
          />
        )}

        {panelSize === 'minimized' ? (
          <div className="flex flex-col h-full items-center pt-4 gap-4">
            <Button variant="ghost" size="icon" onClick={() => setPanelSize('quarter')} aria-label="Expand panel">
              <Bell className="h-5 w-5" />
              {notificationCounts.all > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCounts.all}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {setActiveTab('calendar'); setPanelSize('quarter')}} aria-label="Calendar notifications">
              <Calendar className="h-5 w-5" />
              {notificationCounts.calendar > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCounts.calendar}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => {setActiveTab('comments'); setPanelSize('quarter')}} aria-label="Comment notifications">
              <MessageSquare className="h-5 w-5" />
              {notificationCounts.comments > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCounts.comments}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleDrawingMode} className={isDrawingMode ? "text-blue-500" : ""} aria-label="Drawing mode">
              <Edit3 className="h-5 w-5" />
            </Button>
          </div>
        ) : (
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
                <Button variant="outline" size="icon" onClick={minimizePanel} aria-label="Minimize panel to sidebar">
                  <ArrowLeftRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={toggleDrawingMode} className={isDrawingMode ? "bg-blue-100" : ""} aria-label="Enable drawing mode">
                  <Edit3 className="h-4 w-4" />
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
                  activeTab === 'calendar' ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                )} onClick={() => setActiveTab('calendar')}>
                  Calendar
                  {notificationCounts.calendar > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5">
                      {notificationCounts.calendar}
                    </span>
                  )}
                </div>
                <div className={cn(
                  "relative flex items-center justify-center px-4 py-2 rounded-md cursor-pointer whitespace-nowrap",
                  activeTab === 'comments' ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                )} onClick={() => setActiveTab('comments')}>
                  Comments & Tags
                  {notificationCounts.comments > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5">
                      {notificationCounts.comments}
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

            {/* Drawing Mode Banner - only shows when drawing mode is enabled */}
            {isDrawingMode && (
              <div className="bg-blue-50 p-3 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Drawing Mode Active</span>
                  </div>
                  <button 
                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded"
                    onClick={toggleDrawingMode}
                  >
                    Exit
                  </button>
                </div>
                <p className="text-xs text-blue-600 mt-1">Click on any notification to add annotations.</p>
              </div>
            )}

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
              
              {/* Calendar Booking Requests */}
              {activeTab === 'calendar' && (
                <>
                  <div className="p-4 hover:bg-gray-50 flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium">New booking request</h4>
                      </div>
                      <p className="font-medium">Job #701 - Fence Installation</p>
                      <p className="text-sm text-gray-600">Requested for Jul 20, 10:00 AM - 2:00 PM</p>
                      <span className="text-xs text-gray-500">Jul 15, 09:45 AM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">Approve</button>
                      <button className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">Deny</button>
                      <button className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">Sort Later</button>
                    </div>
                  </div>
                </>
              )}
              
              {/* Comments & Tags */}
              {activeTab === 'comments' && (
                <>
                  <div className="p-4 hover:bg-gray-50 flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium">You were tagged</h4>
                      </div>
                      <p className="font-medium">@admin please review quote #998</p>
                      <div className="mt-2 bg-gray-50 p-2 rounded-md border relative">
                        <p className="text-sm text-gray-600">Customer requested rush delivery</p>
                        <div className="absolute top-0 left-0 right-0 bottom-0 border-2 border-red-500 border-dashed pointer-events-none"></div>
                      </div>
                      <span className="text-xs text-gray-500">Jul 14, 03:22 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">Reply</button>
                      <button className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200" onClick={() => addToSortLater('tag1')}>Sort Later</button>
                    </div>
                  </div>
                  
                  <div className="p-4 hover:bg-gray-50 flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-green-500" />
                        <h4 className="font-medium">New comment on Job #556</h4>
                      </div>
                      <p className="text-sm text-gray-600">Greg added: "Customer is very satisfied with the work"</p>
                      <div className="mt-2 flex gap-2">
                        <img src="https://via.placeholder.com/40" alt="Comment attachment" className="h-16 w-16 rounded object-cover" />
                        <img src="https://via.placeholder.com/40" alt="Comment attachment" className="h-16 w-16 rounded object-cover" />
                      </div>
                      <span className="text-xs text-gray-500">Jul 13, 11:45 AM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">Reply</button>
                      <button className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">Add to Job</button>
                    </div>
                  </div>
                  
                  <div className="p-4 hover:bg-gray-50 flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-blue-500" />
                        <h4 className="font-medium">New tag drop added</h4>
                      </div>
                      <p className="text-sm text-gray-600">Jane tagged a spot on Invoice #1092</p>
                      <div className="mt-2 bg-gray-50 p-2 rounded-md border">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">TD = tag</p>
                          <div className="flex items-center justify-center bg-blue-500 text-white rounded-full h-5 w-5 text-xs font-bold">?</div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">What does this charge cover?</p>
                      </div>
                      <span className="text-xs text-gray-500">Jul 12, 02:18 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">Reply</button>
                      <button className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">View File</button>
                    </div>
                  </div>
                </>
              )}
              
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
        )}
      </div>
    </>
  );
}; 