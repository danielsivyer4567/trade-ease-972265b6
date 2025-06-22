import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Bell, Pin as PinIcon, Maximize2, Minimize2, ArrowLeftRight, Tag as TagIcon, Search, Settings, MessageSquare, Calendar as CalendarIcon, UserPlus, Users, CalendarDays, CircleUser, Shield, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotificationItem from './NotificationItem';
import { useNotifications } from '../contexts/NotificationContext';
import { Notification, PanelSize, ActiveTab, Point, TagData, cn, StaffMember } from '../types';
import { MOCK_BUSINESS_LOGO_URL, PANEL_SIDEBAR_WIDTH, CURRENT_USER_ID, CURRENT_USER_NAME, AVAILABLE_STAFF } from '../constants';
import TagPopup from './TagPopup';
import FullPageDrawingOverlay from './FullPageDrawingOverlay';
import { DrawingState } from '../types'; 

const toast = {
  success: (message: string) => console.log(`Toast Success: ${message}`),
  error: (message: string) => console.error(`Toast Error: ${message}`),
};

interface TaggingDockProps {
  initialTags?: TagData[]; 
  onNewTagCreated: (tag: TagData) => void;
  onTagUpdated: (tag: TagData) => void;
  onTagReplied: (tagId: string, replyText: string) => Promise<TagData | null>;
  onOpenPopupForTagAction: (action: { type: 'view', tag: TagData } | { type: 'new', coords: Point }) => void; 
}

const TaggingDock: React.FC<TaggingDockProps> = ({ initialTags = [], onNewTagCreated, onTagUpdated, onTagReplied, onOpenPopupForTagAction }) => {
  const [activeComponentTab, setActiveComponentTab] = useState<ActiveTab>('tags'); 
  const [panelSize, setPanelSize] = useState<PanelSize>('quarter');
  const [isPinned, setIsPinned] = useState(false);
  const [customWidth, setCustomWidth] = useState(380); 

  const [tagDropModeActive, setTagDropModeActive] = useState(false);

  const [showFullPageDrawing, setShowFullPageDrawing] = useState(false);
  const [fullPageDrawingInitialState, setFullPageDrawingInitialState] = useState<Partial<DrawingState>>({});
  const [fullPageDrawingCurrentInlineData, setFullPageDrawingCurrentInlineData] = useState<string | null>(null);
  const [fullPageDrawingResult, setFullPageDrawingResult] = useState<string | null>(null);
  
  const { notifications, markAsRead, getUnreadCount, addNotification } = useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const getPanelWidth = () => {
    if (panelSize === 'minimized') return '60px'; 
    if (panelSize === 'quarter') return `max(320px, calc(25vw - ${PANEL_SIDEBAR_WIDTH}px))`; 
    if (panelSize === 'half') return `max(450px, calc(50vw - ${PANEL_SIDEBAR_WIDTH}px))`; 
    return `${Math.max(300, customWidth)}px`; 
  };
  
  useEffect(() => {
    const handle = resizeHandleRef.current;
    const panel = panelRef.current;
    if (!handle || !panel || panelSize === 'minimized') return;

    let isResizing = false;

    const onMouseDown = (e: MouseEvent) => {
      isResizing = true;
      document.body.style.userSelect = 'none'; 
      document.body.style.cursor = 'ew-resize';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX - PANEL_SIDEBAR_WIDTH;
      if (newWidth > 280 && newWidth < window.innerWidth * 0.8) { 
        setCustomWidth(newWidth);
        setPanelSize('custom');
      }
    };
    const onMouseUp = () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };
    
    handle.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      handle.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.userSelect = ''; 
      document.body.style.cursor = ''; 
    };
  }, [panelSize]);


  const togglePin = () => setIsPinned(!isPinned);
  const cyclePanelSize = () => {
    setPanelSize(prev => {
      if (prev === 'quarter') return 'half';
      if (prev === 'half') return 'quarter'; 
      if (prev === 'custom') return 'quarter';
      return 'quarter'; 
    });
  };

  const toggleTagDropMode = () => {
    setTagDropModeActive(prev => {
      const nextState = !prev;
      if (nextState) {
        document.body.classList.add('tag-drop-mode-active');
        toast.success("Tag Drop Mode Activated: Click anywhere on the page to place a tag.");
      } else {
        document.body.classList.remove('tag-drop-mode-active');
      }
      return nextState;
    });
  };
  
  const minimizePanel = () => {
    setPanelSize('minimized');
    if (tagDropModeActive) { 
        // Directly toggle off tag drop mode without relying on its previous state for notification
        setTagDropModeActive(false);
        document.body.classList.remove('tag-drop-mode-active');
    }
  };


  const handlePlaceNewTag = useCallback((event: MouseEvent) => {
    if (!tagDropModeActive) return;

    const target = event.target as HTMLElement;
    if (target.closest('.tagging-dock') || target.closest('.tag-popup-content') || target.closest('.full-page-drawing-overlay') || target.closest('.tag-marker')) {
      return;
    }
    
    event.preventDefault();
    event.stopPropagation();

    const popupWidth = 420;
    const popupHeight = 600; 
    let x = event.clientX;
    let y = event.clientY;

    if (x + popupWidth > window.innerWidth - 10) x = window.innerWidth - popupWidth - 10;
    if (y + popupHeight > window.innerHeight - 10) y = window.innerHeight - popupHeight - 10;
    if (x < 10) x = 10;
    if (y < 10) y = 10;
    
    onOpenPopupForTagAction({ type: 'new', coords: { x, y } });
    
    setTagDropModeActive(false); 
    document.body.classList.remove('tag-drop-mode-active');
  }, [tagDropModeActive, onOpenPopupForTagAction]);

  useEffect(() => {
    if (tagDropModeActive) {
      document.addEventListener('click', handlePlaceNewTag, { capture: true }); 
      return () => document.removeEventListener('click', handlePlaceNewTag, { capture: true });
    }
  }, [tagDropModeActive, handlePlaceNewTag]);


  const handleNotificationClick = (tagId?: string) => {
    if (tagId) {
      const tagToView = initialTags.find(t => t.id === tagId); 
      if (tagToView) {
        onOpenPopupForTagAction({ type: 'view', tag: tagToView });
        markAsRead(tagId); 
        notifications.filter(n => n.tagId === tagId).forEach(n => markAsRead(n.id));
      } else {
         toast.error("Could not find the associated tag.");
      }
    }
     // Ensure panel is expanded when a notification is clicked
    if (panelSize === 'minimized') {
        setPanelSize('quarter');
    }
  };
  
  const handleStartFullPageDrawing = (initialState: Partial<DrawingState>, currentInlineData?: string) => {
    setFullPageDrawingInitialState(initialState);
    setFullPageDrawingCurrentInlineData(currentInlineData || null); 
    setShowFullPageDrawing(true);
  };

  const handleSaveFullPageDrawing = (dataUrl: string) => {
    setFullPageDrawingResult(dataUrl);
    setShowFullPageDrawing(false);
  };
  
  const handleCloseFullPageDrawing = () => {
    setShowFullPageDrawing(false);
  };

  const TABS_CONFIG: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'tags', label: 'All Tags', icon: TagIcon },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'mentions', label: 'Mentions', icon: UserPlus },
    { id: 'updates', label: 'Activity', icon: Bell },
  ];

  const filteredNotifications = notifications.filter(n => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = n.title.toLowerCase().includes(searchTermLower) || n.message.toLowerCase().includes(searchTermLower);
    
    if (!matchesSearch) return false;

    if (activeComponentTab === 'tags' || activeComponentTab === 'teams' || activeComponentTab === 'calendar' || activeComponentTab === 'comments') { 
      return false; 
    }
    if (activeComponentTab === 'mentions') return n.type === 'mention';
    if (activeComponentTab === 'updates') return true; 
    return true; 
  });
  
  const displayedTags = initialTags.filter(tag => {
    const searchTermLower = searchTerm.toLowerCase();
    return tag.comment.toLowerCase().includes(searchTermLower) || 
           tag.creatorName.toLowerCase().includes(searchTermLower) ||
           tag.commentHistory.some(r => r.text.toLowerCase().includes(searchTermLower));
  });

  const renderContentForTab = (tab: ActiveTab) => {
    switch (tab) {
      case 'tags':
        return displayedTags.length > 0 ? displayedTags.map(tag => (
          <div key={tag.id} className="p-3 border-b border-gray-100 hover:bg-blue-50/30 cursor-pointer" onClick={() => onOpenPopupForTagAction({ type: 'view', tag })}>
            <div className="flex items-center justify-between mb-0.5">
               <span className="text-xs font-semibold text-blue-600 flex items-center gap-1"><TagIcon className="h-3.5 w-3.5"/> Tag by {tag.creatorName}</span>
               <span className="text-[11px] text-gray-400">{new Date(tag.timestamp).toLocaleDateString()}</span>
            </div>
            <p className="text-xs text-gray-700 truncate">{tag.comment || "No comment"}</p>
            {tag.commentHistory.length > 0 && <span className="text-[11px] text-indigo-500 mt-0.5 block">{tag.commentHistory.length} previous comment{tag.commentHistory.length > 1 ? 's' : ''}</span>}
             {tag.attachments.length > 0 && <span className="text-[11px] text-green-600 mt-0.5 block">{tag.attachments.length} attachment{tag.attachments.length > 1 ? 's' : ''}</span>}
          </div>
        )) : (
          <div className="p-6 text-center text-gray-500">
            <TagIcon className="h-10 w-10 mx-auto mb-2 text-gray-300"/>
            <p className="text-sm">No tags found{searchTerm ? " matching your search" : ""}.</p>
            {!searchTerm && <p className="text-xs mt-1">Start tagging to see them here!</p>}
          </div>
        );
      case 'mentions':
      case 'updates':
        return filteredNotifications.length > 0 ? filteredNotifications.map(notification => (
            <NotificationItem key={notification.id} {...notification} onClick={handleNotificationClick}/>
        )) : (
          <div className="p-6 text-center text-gray-500">
             <Bell className="h-10 w-10 mx-auto mb-2 text-gray-300"/>
             <p className="text-sm">No {tab} {searchTerm ? " matching your search" : ""}.</p>
          </div>
        );
      case 'teams':
      case 'calendar':
      case 'comments':
        const IconForTab = TABS_CONFIG.find(t => t.id === tab)?.icon || Users;
        return (
            <div className="p-6 text-center text-gray-500">
                <IconForTab className="h-10 w-10 mx-auto mb-2 text-gray-300"/>
                <p className="text-sm">{tab.charAt(0).toUpperCase() + tab.slice(1)} content will appear here.</p>
                {searchTerm && <p className="text-xs mt-1">No results for "{searchTerm}" in {tab}.</p>}
            </div>
        );
      default:
        return null;
    }
  }

  const showOverlay = !isPinned && panelSize !== 'minimized';

  return (
    <>
      {showOverlay && (
        <div className="fixed inset-0 bg-black/10 z-40 backdrop-blur-sm" onClick={minimizePanel} aria-hidden="true" />
      )}

      <div
        ref={panelRef}
        className={cn(
          "tagging-dock fixed right-0 top-0 h-screen bg-gradient-to-br from-slate-50 to-gray-100 border-l border-gray-200/80 shadow-2xl transition-all duration-300 ease-in-out flex flex-col",
          // Removed translate-x-full based on isOpen
          isPinned && panelSize !== 'minimized' ? "z-[51]" : "z-50" 
        )}
        style={{ width: getPanelWidth() }}
      >
        {panelSize !== 'minimized' && (
          <div ref={resizeHandleRef} className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize z-[55] hover:bg-blue-400/50 transition-all opacity-50 hover:opacity-100" />
        )}

        {panelSize === 'minimized' ? (
          <div className="flex flex-col h-full items-center pt-5 gap-3"> 
            <button onClick={() => { setPanelSize('quarter'); setActiveComponentTab('updates') }} title="Activity" className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-100/50 rounded-lg transition-colors relative">
              <Bell className="h-5 w-5" /> 
               {getUnreadCount() > 0 && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-slate-50"></span>}
            </button>
            <button onClick={() => { setPanelSize('quarter'); setActiveComponentTab('tags'); }} title="View Tags" className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-100/50 rounded-lg transition-colors">
              <TagIcon className="h-5 w-5" />
            </button>
             <button onClick={() => { setPanelSize('quarter'); setActiveComponentTab('teams'); }} title="Teams" className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-100/50 rounded-lg transition-colors">
              <Users className="h-5 w-5" />
            </button>
            <button onClick={() => { setPanelSize('quarter'); setActiveComponentTab('calendar'); }} title="Calendar" className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-100/50 rounded-lg transition-colors">
              <CalendarDays className="h-5 w-5" />
            </button>
            <button onClick={() => { setPanelSize('quarter'); setActiveComponentTab('comments'); }} title="Comments" className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-100/50 rounded-lg transition-colors">
              <MessageSquare className="h-5 w-5" />
            </button>
            <button onClick={toggleTagDropMode} title={tagDropModeActive ? "Cancel Tag Drop" : "Start Tag Drop"} className={`p-2.5 rounded-lg transition-colors relative ${tagDropModeActive ? "text-red-500 bg-red-100/50 hover:bg-red-200/50" : "text-slate-600 hover:text-blue-600 hover:bg-blue-100/50"}`}>
              <TagIcon className="h-5 w-5" />
              {tagDropModeActive && <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 animate-ping"></span>}
            </button>
            {/* Removed the X button from minimized view */}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center p-3.5 border-b border-gray-200/80 bg-white/70 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <img src={MOCK_BUSINESS_LOGO_URL} alt="Logo" className="h-7 w-7 rounded-md"/>
                <h2 className="text-lg font-semibold text-slate-700">Collaboration Hub</h2>
              </div>
              <div className="flex space-x-1.5">
                <button onClick={togglePin} title={isPinned ? "Unpin" : "Pin"} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-100/50 rounded-md transition-colors">
                  <PinIcon className={cn("h-4 w-4", isPinned && "fill-blue-500 text-blue-500")} />
                </button>
                <button onClick={cyclePanelSize} title="Resize" className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-gray-200/50 rounded-md transition-colors">
                  {panelSize === 'quarter' ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
                <button onClick={minimizePanel} title="Minimize" className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-gray-200/50 rounded-md transition-colors">
                  <ArrowLeftRight className="h-4 w-4" />
                </button>
                {/* Changed this button to call minimizePanel */}
                <button onClick={minimizePanel} title="Close to Minimized" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-100/50 rounded-md transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tag Drop Activation Bar */}
            <div className="p-3.5 border-b border-gray-200/80 bg-white/50">
                <button
                  onClick={toggleTagDropMode}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-1
                    ${tagDropModeActive 
                      ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md hover:shadow-lg focus:ring-red-400" 
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg focus:ring-blue-400"
                    }`}
                >
                  <TagIcon className="h-5 w-5" />
                  {tagDropModeActive ? "Cancel Tag Drop Mode" : "Start Tag Drop"}
                </button>
                {tagDropModeActive && <p className="text-xs text-center text-red-600 mt-1.5">Click anywhere on the page to place a tag.</p>}
            </div>

            {/* Tabs & Search */}
            <div className="p-3 border-b border-gray-200/80 sticky top-0 bg-slate-50/80 backdrop-blur-sm z-10">
              <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                {TABS_CONFIG.map(tabInfo => (
                  <button
                    key={tabInfo.id}
                    onClick={() => setActiveComponentTab(tabInfo.id)}
                    className={cn(
                      "flex items-center justify-center gap-1 p-1.5 rounded-md text-[11px] font-medium transition-colors", 
                      activeComponentTab === tabInfo.id
                        ? "bg-blue-500 text-white shadow-sm"
                        : "bg-white text-slate-600 hover:bg-gray-100 border border-gray-200/80"
                    )}
                    title={tabInfo.label}
                  >
                    <tabInfo.icon className="h-3 w-3" /> 
                    <span className="truncate leading-tight">{tabInfo.label}</span>
                    {tabInfo.id === 'updates' && getUnreadCount() > 0 && (
                        <span className="ml-0.5 px-1 py-0 text-[9px] bg-red-500 text-white rounded-full">{getUnreadCount()}</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search in ${TABS_CONFIG.find(t=>t.id === activeComponentTab)?.label || 'content'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300/80 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {renderContentForTab(activeComponentTab)}
            </div>
            
            <div className="p-3 mt-auto border-t border-gray-200/80 bg-slate-100/50">
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => console.log('Accounts clicked')} className="flex flex-col items-center justify-center gap-1 py-2 px-1 text-slate-600 hover:bg-slate-200/70 hover:text-blue-600 rounded-md text-xs transition-colors" title="Accounts">
                        <CircleUser className="h-4 w-4" />
                        <span>Accounts</span>
                    </button>
                     <button onClick={() => console.log('Security clicked')} className="flex flex-col items-center justify-center gap-1 py-2 px-1 text-slate-600 hover:bg-slate-200/70 hover:text-blue-600 rounded-md text-xs transition-colors" title="Security">
                        <Shield className="h-4 w-4" />
                        <span>Security</span>
                    </button>
                     <button onClick={() => console.log('Permissions clicked')} className="flex flex-col items-center justify-center gap-1 py-2 px-1 text-slate-600 hover:bg-slate-200/70 hover:text-blue-600 rounded-md text-xs transition-colors" title="Permissions">
                        <KeyRound className="h-4 w-4" />
                        <span>Permissions</span>
                    </button>
                </div>
            </div>


            {/* Footer Link */}
            <div className="p-3 border-t border-gray-200/80 text-center">
              <Link to="/all-activity" className="text-xs text-blue-600 hover:underline" onClick={isPinned ? undefined : minimizePanel}>
                View All Activity
              </Link>
            </div>
          </>
        )}
      </div>
      
       <FullPageDrawingOverlay
        isOpen={showFullPageDrawing}
        onClose={() => {
            handleCloseFullPageDrawing();
            if (localStorage.getItem('tagPopupOpenBeforeFullDraw') === 'true') {
                localStorage.removeItem('tagPopupOpenBeforeFullDraw');
            }
        }}
        onSave={(dataUrl) => {
            handleSaveFullPageDrawing(dataUrl);
             if (localStorage.getItem('tagPopupOpenBeforeFullDraw') === 'true') {
                 localStorage.removeItem('tagPopupOpenBeforeFullDraw');
             }
        }}
        initialDrawingState={fullPageDrawingInitialState}
      />
    </>
  );
};

export default TaggingDock;