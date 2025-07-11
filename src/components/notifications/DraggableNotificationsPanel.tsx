import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Bell, Maximize2, Minimize2, ArrowLeftRight, Pin, Calendar, MessageSquare, Tag, Edit3, Image, Save, Mic, Trash2, Brush, AlertCircle, Minus, MoveUpRight, Square, Circle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';
import { useNotifications, type Notification } from './NotificationContextProvider';
import { createTag, type TagData } from '@/services/tagService';
import { toast } from 'sonner';
import DrawingCanvas, { DrawingToolbar } from './DrawingCanvas';
import { Point, DrawingState, DrawingTool } from './types';

type PanelSize = 'quarter' | 'half' | 'custom' | 'minimized';
type ActiveTab = 'all' | 'team' | 'trades' | 'account' | 'security' | 'calendar' | 'comments';

interface TagMarker {
  id: string;
  x: number;
  y: number;
  timestamp: number; // To manage temporary display
  drawingData?: string; // Store drawing data URL
}

interface StaffMember {
    id: string;
    name: string;
}

interface UploadedFile {
    file: File;
    previewUrl: string; // For images
    type: 'image' | 'audio' | 'drawing';
    supabaseUrl?: string; // Set after successful upload
}


interface TagPopupPosition {
  x: number;
  y: number;
}

interface DraggableNotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  businessLogoUrl?: string; // Pass your business logo URL here
  currentUserId: string; // Needed for Supabase pathing potentially
  availableStaff: StaffMember[]; // Pass the list of available staff
}

// Placeholder for Supabase upload functions - replace with your actual implementation
const uploadFileToSupabase = async (file: File, folder: string, fileName: string): Promise<string> => {
  console.log(`[Placeholder] Uploading ${fileName} to Supabase folder: ${folder}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate upload delay
  const mockUrl = `https://mock-supabase.com/${folder}/${fileName}`;
  console.log(`[Placeholder] Uploaded to: ${mockUrl}`);
  return mockUrl;
};

export const DraggableNotificationsPanel = ({
  isOpen,
  onClose,
  businessLogoUrl = '/business-logo.png', // Trade tools business logo
  currentUserId = 'user_abc', // Example user ID
  availableStaff = [ { id: 'staff1', name: 'Alice' }, { id: 'staff2', name: 'Bob' }] // Example staff
}: DraggableNotificationsPanelProps) => {
  
  // Debug logging
  console.log('DraggableNotificationsPanel render:', { isOpen, currentUserId, availableStaff: availableStaff.length });
  
  // Add local override state for testing
  const [forceOpen, setForceOpen] = useState(false);
  const effectiveIsOpen = forceOpen || isOpen;
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [panelSize, setPanelSize] = useState<PanelSize>('quarter');
  const [isPinned, setIsPinned] = useState(false);
  const [customWidth, setCustomWidth] = useState(350);
  const [isDrawingMode, setIsDrawingMode] = useState(false); // General panel drawing mode
  const [sortLater, setSortLater] = useState<string[]>([]);
  
  // --- Tag Drop State ---
  const [tagDropModeActive, setTagDropModeActive] = useState(false);
  const [isTagPopupOpen, setIsTagPopupOpen] = useState(false);
  const [tagPopupCoords, setTagPopupCoords] = useState<TagPopupPosition | null>(null);
  const [tagMarkers, setTagMarkers] = useState<TagMarker[]>([]);
  const activeTagPopupElement = useRef<HTMLDivElement | null>(null);
  
  // Add drag state for the tag popup
  const [isDraggingPopup, setIsDraggingPopup] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // --- State for within the Tag Popup ---
  const [tagComment, setTagComment] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isDrawingActive, setIsDrawingActive] = useState(false); // For drawing within the tag
  const [staffSelectionError, setStaffSelectionError] = useState<string | null>(null);
  
  const panelRef = useRef<HTMLDivElement>(null);
  const leftResizeHandleRef = useRef<HTMLDivElement>(null);
  const { notifications, markAllAsRead } = useNotifications(); // Assuming this context provides notifications

  const SIDEBAR_WIDTH = 50;
  const isDevelopment = import.meta.env.DEV;

  const getPanelWidth = () => {
    if (panelSize === 'minimized') return '60px';
    if (panelSize === 'quarter') return `calc(25vw - ${SIDEBAR_WIDTH}px)`;
    if (panelSize === 'half') return `calc(50vw - ${SIDEBAR_WIDTH}px)`;
    return `${customWidth}px`;
  };
  


  // --- Cleanup temporary markers ---
  useEffect(() => {
    const interval = setInterval(() => {
      setTagMarkers(prev => prev.filter(marker => Date.now() - marker.timestamp < 3000)); // Remove markers older than 3 seconds
    }, 1000); // Check every second
    return () => clearInterval(interval);
  }, []);
  
  // --- Cleanup active popup if panel closes ---
   useEffect(() => {
     if (!isOpen && isTagPopupOpen) {
       closeTagPopup();
     }
   }, [isOpen, isTagPopupOpen]);


  // --- Panel Control Functions ---
  const togglePin = () => setIsPinned(!isPinned);
  const togglePanelSize = () => setPanelSize(prev => prev === 'minimized' ? 'quarter' : prev === 'quarter' ? 'half' : 'quarter');
  const minimizePanel = () => setPanelSize('minimized');
  const addToSortLater = (id: string) => setSortLater(prev => [...prev, id]);
  const toggleGeneralDrawingMode = () => setIsDrawingMode(!isDrawingMode);

  const showOverlay = isOpen && !isPinned;
  const notificationCounts = { all: 25, team: 5, trades: 9, calendar: 3, comments: 6, account: 0, security: 0 };


  // --- Tag Drop Core Logic ---

  // Toggles the overall Tag Drop mode on/off
  const toggleTagDropMode = () => {
    console.log('[TagDropMode] Toggling tag drop mode. Current state:', tagDropModeActive);
    setTagDropModeActive(prev => {
      const nextState = !prev;
      console.log('[TagDropMode] New state will be:', nextState);
      if (!nextState) {
        console.log('[TagDropMode] Deactivating - closing popup and resetting cursor');
        closeTagPopup();
        document.body.style.cursor = '';
      } else {
        console.log('[TagDropMode] Activating - setting cursor to crosshair');
        document.body.style.cursor = 'crosshair';
      }
      return nextState;
    });
  };

  // Resets the state associated with the tag popup content
  const resetTagPopupState = () => {
      setTagComment('');
      setSelectedStaff([]);
      setUploadedFiles([]);
      setIsRecordingAudio(false);
      setIsDrawingActive(false);
      setStaffSelectionError(null);
      setTagPopupCoords(null);
      setDrawingPreviewUrl(null); // NEW: reset drawing preview
  };

  // NEW: Store the preview URL of the drawing
  const [drawingPreviewUrl, setDrawingPreviewUrl] = useState<string | null>(null);

  // Closes the tag pop-up window and resets state
  const closeTagPopup = useCallback(() => {
    setIsTagPopupOpen(false);
    resetTagPopupState();
    document.body.style.cursor = tagDropModeActive ? 'crosshair' : '';
  }, [tagDropModeActive]);

  // Handle click on page to place a new tag (for CREATION)
  const handlePlaceNewTag = useCallback((event: MouseEvent) => {
    console.log('[TagDrop] Handling click event. Mode active:', tagDropModeActive);
    
    // Don't prevent default or stop propagation immediately
    // Only do this if we're actually going to handle the click
    if (!tagDropModeActive) {
      console.log('[TagDrop] Mode not active, ignoring click');
      return;
    }

    const target = event.target as HTMLElement;
    const isNotification = target.closest('.notification-item');
    const isPanel = target.closest('.notifications-panel');

    if (isNotification || isPanel) {
      console.log('[TagDrop] Click was on notification or panel, ignoring');
      return;
    }

    // Now we know we're handling this click
    event.preventDefault();
    event.stopPropagation();

    console.log('[TagDrop] Placing new tag at:', event.clientX, event.clientY);

    // Place popup at click location (with bounds check)
    const popupWidth = 380;
    const popupHeight = 400;
    let x = event.clientX;
    let y = event.clientY;
    if (x + popupWidth > window.innerWidth) x = window.innerWidth - popupWidth - 10;
    if (y + popupHeight > window.innerHeight) y = window.innerHeight - popupHeight - 10;

    setTimeout(() => {
      console.log('[TagDrop] Setting popup coordinates:', x, y);
      setTagPopupCoords({ x, y });
      setIsTagPopupOpen(true);
    }, 0);
  }, [tagDropModeActive]);


  // --- Handlers for actions WITHIN the tag pop-up ---

  const handleStaffSelect = (staff: StaffMember) => {
    setSelectedStaff(prev => {
      const isSelected = prev.some(s => s.id === staff.id);
      setStaffSelectionError(null); // Clear error on selection change
      return isSelected ? prev.filter(s => s.id !== staff.id) : [...prev, staff];
    });
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTagComment(event.target.value);
  };

  // Placeholder for image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const newFile: UploadedFile = {
                  file,
                  previewUrl: reader.result as string,
                  type: 'image'
              };
              setUploadedFiles(prev => [...prev, newFile]);
          }
          reader.readAsDataURL(file);
      }
  };
  
  // Clear canvas function
  const clearCanvas = useCallback(() => {
    setDrawingPreviewUrl(null);
    setUploadedFiles(prev => prev.filter(f => f.type !== 'drawing'));
    // Force re-render of canvas by toggling drawing state
    setIsDrawingActive(false);
    setTimeout(() => setIsDrawingActive(true), 10);
  }, []);
  
  // Placeholder for drawing
  const handleToggleDrawing = () => {
    const nextIsDrawingActive = !isDrawingActive;
    setIsDrawingActive(nextIsDrawingActive);
    setDrawingState(prev => ({ ...prev, isActive: nextIsDrawingActive }));
    if (!nextIsDrawingActive) {
      clearCanvas();
    }
  };

  // Placeholder for audio recording
  const handleToggleAudioRecord = () => {
      console.log("[Placeholder] Toggle audio recording");
      setIsRecordingAudio(!isRecordingAudio);
       // Simulate adding/removing audio placeholder
      if (!isRecordingAudio && !uploadedFiles.some(f => f.type === 'audio')) {
         const audioPlaceholder: UploadedFile = {
             file: new File([], "recording.mp3"), // Dummy file
             previewUrl: "", // No visual preview for audio usually
             type: 'audio'
         };
         setUploadedFiles(prev => [...prev, audioPlaceholder]);
      } else if (isRecordingAudio) {
         setUploadedFiles(prev => prev.filter(f => f.type !== 'audio'));
      }
  };
  
  const removeUploadedFile = (index: number) => {
      const fileToRemove = uploadedFiles[index];
      // If removing drawing/audio placeholder, update the respective state
      if (fileToRemove.type === 'drawing') setIsDrawingActive(false);
      if (fileToRemove.type === 'audio') setIsRecordingAudio(false);
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // --- Save Tag Logic ---
  const handleSaveTag = async () => {
    if (selectedStaff.length === 0) {
      setStaffSelectionError('You must select at least one staff member to notify.');
      return;
    }
    setStaffSelectionError(null);

    try {
      // 1. Upload files first
      const uploadPromises = uploadedFiles.map(async (uploadedFile) => {
        const folderPath = `tag_drops/${Date.now()}`;
        let fileName = uploadedFile.file.name;
        if (uploadedFile.type === 'drawing') fileName = 'drawing.png';
        if (uploadedFile.type === 'audio') fileName = 'recording.mp3';
        
        try {
          const url = await uploadFileToSupabase(uploadedFile.file, folderPath, fileName);
          return { ...uploadedFile, supabaseUrl: url };
        } catch (error) {
          console.error("Upload failed:", error);
          return { ...uploadedFile, supabaseUrl: undefined };
        }
      });
      
      const uploadedFilesWithUrls = await Promise.all(uploadPromises);

      // 2. Create tag data
      const tagData: Omit<TagData, 'id' | 'timestamp'> = {
        creatorId: currentUserId,
        comment: tagComment,
        taggedStaffIds: selectedStaff.map(s => s.id),
        attachments: uploadedFilesWithUrls
          .filter(f => f.supabaseUrl)
          .map(f => ({ type: f.type, url: f.supabaseUrl! })),
        coords: tagPopupCoords!,
        drawingData: drawingPreviewUrl || tagCanvasRef.current?.toDataURL('image/png') // Use preview if available
      };

      // 3. Save tag to database
      const savedTag = await createTag(tagData);

      // 4. Show success notification
      toast.success('Tag created successfully!');

      // 5. Close popup and reset state
      closeTagPopup();

      // 6. Add marker to the page
      if (tagPopupCoords) {
        const newMarker: TagMarker = {
          id: savedTag.id,
          x: tagPopupCoords.x,
          y: tagPopupCoords.y,
          timestamp: Date.now(),
          drawingData: drawingPreviewUrl || savedTag.drawingData // Use preview if available
        };
        setTagMarkers(prev => [...prev, newMarker]);
      }

    } catch (error) {
      console.error('Failed to save tag:', error);
      toast.error('Failed to save tag. Please try again.');
    }
  };

  // --- Event Listener for Placing Tag (useEffect) ---
  useEffect(() => {
    console.log('[TagDropEffect] Running effect. Mode active:', tagDropModeActive); // Log effect run
    
    const listener = (event: MouseEvent) => {
      // Only process the event if the component is still mounted
      if (isMountedRef.current) {
        handlePlaceNewTag(event);
      }
    };

    if (tagDropModeActive) {
        console.log('[TagDropEffect] Adding click listener.'); // Log listener add
        document.addEventListener('click', listener); // Removed true parameter for bubbling
    } else {
        console.log('[TagDropEffect] Removing click listener.'); // Log listener remove
        document.removeEventListener('click', listener);
    }
    
    // Cleanup function
    return () => {
      console.log('[TagDropEffect] Cleanup: Removing click listener.'); // Log cleanup
      document.removeEventListener('click', listener);
      // Ensure cursor is reset if component unmounts while mode is active
      if (tagDropModeActive) {
          console.log('[TagDropEffect] Cleanup: Resetting cursor.'); // Log cursor reset
          document.body.style.cursor = '';
      }
    };
  }, [tagDropModeActive, handlePlaceNewTag]);
  
  // Effect to set mounted state and cleanup drawing events
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clean up any pending drawing operations
      setIsDrawing(false);
      setLastPoint(null);
      // Reset cursor if tag drop mode was active
      if (tagDropModeActive) {
        document.body.style.cursor = '';
      }
    };
  }, [tagDropModeActive]); 

  // Add states for drawing
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isActive: false,
    tool: 'pencil',
    color: '#000000',
    lineWidth: 2,
    isDrawingOnPage: false
  });
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  
  // Refs for canvases
  const tagCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  // Ref to track if component is mounted (for cleanup)
  const isMountedRef = useRef(true);
  
  // Simple drawing state tracking with proper initialization
  const drawingStateRef = useRef(drawingState);
  const isDrawingRef = useRef(isDrawing);
  const lastPointRef = useRef(lastPoint);
  
  // Drawing tool refs to prevent conflicts
  const drawingToolsRef = useRef<HTMLDivElement>(null);
  
  // Keep refs in sync with state
  useEffect(() => {
    drawingStateRef.current = drawingState;
  }, [drawingState]);
  
  useEffect(() => {
    isDrawingRef.current = isDrawing;
  }, [isDrawing]);
  
  useEffect(() => {
    lastPointRef.current = lastPoint;
  }, [lastPoint]);
  
  // Helper function to update drawing state
  const updateDrawingState = useCallback(<K extends keyof DrawingState>(key: K, value: DrawingState[K]) => {
    setDrawingState(prev => ({ ...prev, [key]: value }));
  }, []);
  
  

  // Helper to convert data URL to File
  const dataURLtoFile = (dataurl: string, filename: string): File | null => {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime || 'image/png' });
  };
  

  // Handle starting popup drag operation
  const handlePopupDragStart = (e: React.MouseEvent) => {
    if (activeTagPopupElement.current && tagPopupCoords) {
      const target = e.target as HTMLElement;
      const isDragHandle = target.closest('.popup-drag-handle');
      const isButton = target.closest('button, .button, [role="button"]');
      // Only allow drag from header, and not from a button
      if (!isDragHandle || isButton) return;
      setIsDraggingPopup(true);
      const rect = activeTagPopupElement.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.stopPropagation();
    }
  };
  
  // Handle popup dragging
  const handlePopupDrag = useCallback((e: MouseEvent) => {
    if (isDraggingPopup && tagPopupCoords) {
      setTagPopupCoords({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
      
      // Prevent other events
      e.preventDefault();
      e.stopPropagation();
    }
  }, [isDraggingPopup, tagPopupCoords, dragOffset]);
  
  // Handle ending popup drag
  const handlePopupDragEnd = useCallback(() => {
    setIsDraggingPopup(false);
  }, []);
  
  // Set up global mouse event listeners for dragging
  useEffect(() => {
    if (isDraggingPopup) {
      document.addEventListener('mousemove', handlePopupDrag);
      document.addEventListener('mouseup', handlePopupDragEnd);
      
      // Add temporary dragging cursor to the whole document
      document.body.style.cursor = 'move';
      
      return () => {
        document.removeEventListener('mousemove', handlePopupDrag);
        document.removeEventListener('mouseup', handlePopupDragEnd);
        document.body.style.cursor = '';
      };
    }
  }, [isDraggingPopup, handlePopupDrag, handlePopupDragEnd]);





  // Defensive: On mouseup anywhere, always stop dragging
  useEffect(() => {
    const stopDrag = () => setIsDraggingPopup(false);
    document.addEventListener('mouseup', stopDrag);
    return () => document.removeEventListener('mouseup', stopDrag);
  }, []);


  // When drawing is finished in the popup, update preview
  const handleDrawingFinish = useCallback((dataUrl: string) => {
    setDrawingPreviewUrl(dataUrl);
    // Add/replace drawing in uploadedFiles
    setUploadedFiles(prev => {
      const others = prev.filter(f => f.type !== 'drawing');
      return [
        ...others,
        {
          file: dataURLtoFile(dataUrl, 'drawing.png')!,
          previewUrl: dataUrl,
          type: 'drawing',
        },
      ];
    });
  }, []);

  return (
    <>
      {/* Debug Test Button - ALWAYS VISIBLE */}
      <div className="fixed top-4 left-4 z-[9999] flex gap-2">
        <Button 
          onClick={() => {
            console.log('🔄 Test button clicked! isOpen:', isOpen, 'forceOpen:', forceOpen);
            setForceOpen(!forceOpen);
          }}
          className={cn(
            "px-4 py-2 rounded text-sm font-bold",
            forceOpen ? "bg-green-500 text-white" : "bg-purple-500 text-white"
          )}
        >
          🧪 FORCE PANEL {forceOpen ? 'ON' : 'OFF'}
        </Button>
        <Button 
          onClick={() => {
            console.log('📊 Status - isOpen:', isOpen, 'forceOpen:', forceOpen, 'effectiveIsOpen:', effectiveIsOpen);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold"
        >
          📊 DEBUG STATUS
        </Button>
      </div>
      
      {/* Debug indicator */}
      {effectiveIsOpen && (
        <div className="fixed top-4 right-4 z-[9999] bg-green-500 text-white p-2 rounded text-sm font-bold">
          PANEL OPEN - isOpen:{isOpen ? 'T' : 'F'} force:{forceOpen ? 'T' : 'F'} - {panelSize}
        </div>
      )}
      
      {/* Overlay */}
      {showOverlay && ( <div className="fixed inset-0 bg-black/20 z-40" onClick={isPinned ? undefined : onClose} aria-hidden="true" /> )}

      {/* Temporary Tag Markers (Logos) */}
      {tagMarkers.map(marker => (
        <div
          key={marker.id}
          className="tag-marker fixed z-[99] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-opacity duration-300 pointer-events-none"
          style={{ left: `${marker.x}px`, top: `${marker.y}px`, opacity: 1 }}
          title="Tag placed"
        >
          {marker.drawingData ? (
            <img src={marker.drawingData} alt="Tag Drawing" className="w-8 h-8 drop-shadow-lg rounded-full border-2 border-blue-400 bg-white" />
          ) : (
            <img src={businessLogoUrl} alt="Tag marker" className="w-8 h-8 drop-shadow-lg" />
          )}
        </div>
      ))}

      {/* --- Tag Drop Popup (Updated with draggable header) --- */}
      {isTagPopupOpen && tagPopupCoords && (
          <div
              ref={activeTagPopupElement}
              className="tag-popup-content fixed bg-white border border-gray-300 rounded-lg shadow-xl z-[100] w-[380px] flex flex-col"
              style={{ 
                left: `${tagPopupCoords.x}px`, 
                top: `${tagPopupCoords.y}px`,
                cursor: isDraggingPopup ? 'move' : 'default',
                pointerEvents: 'auto',
                zIndex: 999999
              }}
          >
              {/* Header - Drag handle */}
              <div 
                className="popup-drag-handle flex justify-between items-center p-3 border-b bg-slate-400 rounded-t-lg cursor-move"
                onMouseDown={handlePopupDragStart} 
              >
                  <div className="flex items-center gap-2 text-white">
                      <Tag className="h-5 w-5" />
                      <span className="font-semibold">Create Tag</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-slate-500" onClick={closeTagPopup}>
                      <X className="h-4 w-4" />
                  </Button>
              </div>

              {/* Content Area */}
              <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
                  {/* Comment */}
                  <textarea
                      className="w-full p-2 text-sm border rounded-md resize-none focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      placeholder="Add a comment... (optional)"
                      rows={3}
                      value={tagComment}
                      onChange={handleCommentChange}
                  />

                  {/* Staff Selection */}
                  <div className="border rounded-md p-3">
                      <label className="text-sm font-medium text-gray-700 block mb-2">Notify Staff <span className="text-red-500">*</span></label>
                      <div className="max-h-24 overflow-y-auto mb-2 border-t border-b py-1">
                          {availableStaff.map(staff => (
                              <div key={staff.id} className="flex items-center justify-between px-2 py-1 hover:bg-gray-50">
                                  <span className="text-sm">{staff.name}</span>
                                  <input
                                      type="checkbox"
                                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                      checked={selectedStaff.some(s => s.id === staff.id)}
                                      onChange={() => handleStaffSelect(staff)}
                                  />
                              </div>
                          ))}
                      </div>
                      {selectedStaff.length > 0 && (
                         <div className="flex flex-wrap gap-1 mt-1">
                             {selectedStaff.map(s => (
                                <span key={s.id} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{s.name}</span>
                             ))}
                         </div>
                      )}
                      {staffSelectionError && (
                           <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                               <AlertCircle className="h-3 w-3" /> {staffSelectionError}
                           </p>
                      )}
                  </div>

                  {/* Attachments */}
                  <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Attachments</label>
                      {/* Previews */}
                      {uploadedFiles.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2 border p-2 rounded-md bg-gray-50">
                              {uploadedFiles.map((uploadedFile, index) => (
                                  <div key={index} className="relative w-14 h-14">
                                      {uploadedFile.type === 'image' && (
                                         <img src={uploadedFile.previewUrl} alt="Preview" className="w-full h-full object-cover rounded border" />
                                      )}
                                      {uploadedFile.type === 'drawing' && uploadedFile.previewUrl && (
                                        <img src={uploadedFile.previewUrl} alt="Drawing Preview" className="w-full h-full object-cover rounded border bg-white" />
                                      )}
                                      {uploadedFile.type === 'drawing' && !uploadedFile.previewUrl && (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded border">
                                          <Brush className="h-6 w-6 text-gray-600"/>
                                        </div>
                                      )}
                                      {uploadedFile.type === 'audio' && (
                                         <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded border">
                                             <Mic className="h-6 w-6 text-gray-600"/>
                                         </div>
                                      )}
                                      <Button
                                          variant="destructive" size="icon"
                                          className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0"
                                          onClick={() => removeUploadedFile(index)}
                                      >
                                          <X className="h-2.5 w-2.5" />
                                      </Button>
                                  </div>
                              ))}
                          </div>
                      )}
                      {/* Attachment Action Buttons */}
                      <div className="flex items-center gap-2">
                           <Button 
                               variant="outline" 
                               size="sm" 
                               className="flex-1 text-xs gap-1" 
                               onClick={() => document.getElementById('tag-image-upload')?.click()}
                           >
                               <Image className="h-3.5 w-3.5"/> Image
                               <input type="file" id="tag-image-upload" accept="image/*" className="hidden" onChange={handleImageUpload}/>
                           </Button>
                           <Button 
                               variant="outline" 
                               size="sm" 
                               className={cn(
                                   "flex-1 text-xs gap-1", 
                                   isDrawingActive ? 'bg-blue-100 text-blue-700 border-blue-300' : '' 
                               )} 
                               onClick={() => {
                                   setIsDrawingActive(!isDrawingActive);
                                   setDrawingState(prev => ({ ...prev, isActive: !isDrawingActive }));
                               }}
                           >
                               <Brush className="h-3.5 w-3.5"/> Draw
                           </Button>
                           <Button 
                               variant="outline" 
                               size="sm" 
                               className={cn(
                                   "flex-1 text-xs gap-1", 
                                   isRecordingAudio ? 'bg-red-100 text-red-700 border-red-300' : '' 
                               )} 
                               onClick={() => {
                                   setIsRecordingAudio(!isRecordingAudio);
                                   if (!isRecordingAudio && !uploadedFiles.some(f => f.type === 'audio')) {
                                       const audioPlaceholder: UploadedFile = {
                                           file: new File([], "recording.mp3"),
                                           previewUrl: "",
                                           type: 'audio'
                                       };
                                       setUploadedFiles(prev => [...prev, audioPlaceholder]);
                                   } else if (isRecordingAudio) {
                                       setUploadedFiles(prev => prev.filter(f => f.type !== 'audio'));
                                   }
                               }}
                           >
                               <Mic className="h-3.5 w-3.5"/> Voice
                           </Button>
                      </div>
                      
                      {/* Drawing Toolbar */}
                      {isDrawingActive && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                              <DrawingToolbar 
                                  drawingState={drawingState}
                                  onStateChange={updateDrawingState}
                                  className="mb-3"
                              />
                              
                              <DrawingCanvas 
                                  width={340} 
                                  height={200} 
                                  drawingState={drawingState}
                                  onDrawEnd={handleDrawingFinish}
                                  initialDrawingDataUrl={drawingPreviewUrl || undefined}
                              />
                              
                              <div className="flex gap-2 mt-2">
                                  <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 text-xs"
                                      onClick={clearCanvas}
                                  >
                                      Clear Canvas
                                  </Button>
                                  <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 text-xs"
                                      onClick={() => toast.info('Full-page drawing coming soon!')}
                                  >
                                      <Brush className="h-3.5 w-3.5 mr-1" />
                                      Full Page (Soon)
                                  </Button>
                              </div>
                          </div>
                      )}
                  </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 p-3 border-t bg-gray-50 rounded-b-lg">
                  <Button 
                      variant="ghost" 
                      onClick={closeTagPopup}
                  >
                      Cancel
                  </Button>
                  <Button 
                      onClick={handleSaveTag}
                  >
                      <Save className="h-4 w-4 mr-1"/> Save Tag
                  </Button>
              </div>
          </div>
      )}


      {/* Notifications Panel */}
      <div
        ref={panelRef}
        className={cn(
          "fixed right-0 top-0 h-screen bg-white z-50 shadow-lg transition-all duration-300 ease-in-out", // Keep base styles & transition
          effectiveIsOpen ? "" : "hidden", // Use effectiveIsOpen for testing
          isPinned ? "border-l border-gray-200" : ""
        )}
        style={{ width: getPanelWidth() }}
      >
        {/* Left Resize Handle */}
        {panelSize !== 'minimized' && (
          <div ref={leftResizeHandleRef} className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize z-50 hover:bg-blue-400 hover:w-1.5 transition-all" />
        )}

        {panelSize === 'minimized' ? (
           <div className="flex flex-col h-full items-center pt-4 gap-4">
                {/* Minimized Icons */}
                <Button variant="ghost" size="icon" onClick={() => setPanelSize('quarter')}><Bell className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => {setActiveTab('calendar'); setPanelSize('quarter')}}><Calendar className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => {setActiveTab('comments'); setPanelSize('quarter')}}><MessageSquare className="h-5 w-5" /></Button>
                 {/* Use specific toggle for tag drop mode */}
                 <Button variant="ghost" size="icon" onClick={toggleTagDropMode} className={tagDropModeActive ? "text-blue-500" : ""} title="Tag Drop Mode">
                     <Tag className="h-5 w-5" />
                 </Button>
           </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</h2>
              <div className="flex space-x-1">
                <Button variant="outline" size="icon" onClick={togglePin} title={isPinned ? "Unpin panel" : "Pin panel"}>
                    <Pin className={cn("h-4 w-4", isPinned && "fill-current text-blue-600")} />
                </Button>
                <Button variant="outline" size="icon" onClick={togglePanelSize} title="Resize panel">
                  {panelSize === 'quarter' ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />} 
                </Button>
                <Button variant="outline" size="icon" onClick={minimizePanel} title="Minimize panel"><ArrowLeftRight className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={onClose} title="Close panel"><X className="h-5 w-5" /></Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="border-b">
              <div className="flex overflow-x-auto px-4 py-2 gap-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {(Object.keys(notificationCounts) as ActiveTab[]).map(tab => (
                    <div key={tab} className={cn(
                        "relative flex items-center justify-center px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap text-sm",
                        activeTab === tab ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                      )} onClick={() => setActiveTab(tab)}>
                          {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                          {notificationCounts[tab] > 0 && (
                            <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 leading-none">
                              {notificationCounts[tab]}
                            </span>
                          )}
                    </div>
                ))}
              </div>
            </div>

            {/* Activity Dashboard Section (Tag Drop Control) */}
            <div className="bg-gray-50 p-4 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Tag Drop</h3>
                  <p className="text-xs text-gray-500">
                    {tagDropModeActive ? "Click anywhere on the page to place a tag." : "Tag specific parts of the page for comments."}
                  </p>
                </div>
                <Button
                  size="sm"
                  className={cn(
                    "text-xs flex items-center gap-1",
                    tagDropModeActive
                      ? "bg-red-100 text-red-700 hover:bg-red-200" 
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                  )}
                  onClick={toggleTagDropMode}
                >
                  <Tag className="h-3.5 w-3.5" />
                  {tagDropModeActive ? "Cancel Tag Drop" : "Start Tag Drop"}
                </Button>
              </div>
            </div>

            {/* Notification List Area */}
            <div className="flex-1 overflow-y-auto divide-y">
              {(() => {
                 type NotificationType = Notification['type']; 

                const getVisibleTypesForTab = (tab: ActiveTab): Array<NotificationType> => {
                    switch (tab) {
                        case 'trades':
                            return ['job', 'quote', 'payment']; 
                        case 'comments':
                            return ['message', 'other']; 
                        default:
                            return []; 
                    }
                };

                const filteredNotifications = notifications.filter(n => {
                    if (activeTab === 'all') return true;
                    const visibleTypes = getVisibleTypesForTab(activeTab);
                    return visibleTypes.includes(n.type);
                });

                 if (filteredNotifications.length === 0) {
                     let emptyMessage = `No ${activeTab} notifications`;
                     if (activeTab === 'all') emptyMessage = "No notifications";
                     if (activeTab === 'comments') emptyMessage = "Comment & Tag notifications will show here.";
                     
                     return (
                         <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
                             <Bell className="h-10 w-10 mb-3 text-gray-300" />
                             <p className="text-sm">{emptyMessage}</p>
                         </div>
                     );
                 }

                return filteredNotifications.map(notification =>
                    <NotificationItem
                        key={notification.id}
                        {...notification}
                        isPanelPinned={isPinned}
                    />
                );
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t">
              <Link to="/notifications" className="text-blue-600 text-sm text-center block w-full hover:underline" onClick={isPinned ? undefined : onClose}>
                View all notifications
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}; 