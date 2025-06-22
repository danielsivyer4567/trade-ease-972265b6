import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Bell, PinIcon, Maximize2, Minimize2, ArrowLeftRight, Pin, Calendar, MessageSquare, Tag, Edit3, Image, UploadCloud, MessageCircle, Save, Mic, Trash2, Brush, Paperclip, UserPlus, AlertCircle, Minus, MoveUpRight, Square, Circle, Star, Reply } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';
import { useNotifications, type Notification } from './NotificationContextProvider';
import { createTag, type TagData } from '@/services/tagService';
import { toast } from 'sonner';

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

interface DrawingState {
  isActive: boolean;
  tool: 'pencil' | 'text' | 'eraser' | 'line' | 'arrow' | 'rectangle' | 'circle' | 'star';
  color: string;
  lineWidth: number;
  isDrawingOnPage: boolean; // Whether drawing is happening on the whole page
}

interface Point {
  x: number;
  y: number;
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

// DrawingCanvas component for simpler, direct drawing
const DrawingCanvas = ({ 
  width, 
  height, 
  drawingState, 
  canvasRef,
  drawArrow,
  drawStar
}: { 
  width: number, 
  height: number, 
  drawingState: DrawingState, 
  canvasRef: React.RefObject<HTMLCanvasElement>,
  drawArrow: (ctx: CanvasRenderingContext2D, from: Point, to: Point, color: string, lineWidth: number) => void,
  drawStar: (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, points: number, radius: number, color: string, lineWidth: number) => void
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('[DrawingCanvas] Mouse Down Event:', e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    e.stopPropagation();
    e.preventDefault();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !canvasRef.current) return;
    
    const point = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    };
    
    setIsDrawing(true);
    setLastPoint(point);
    console.log('[DrawingCanvas] State after Mouse Down:', { isDrawing: true, lastPoint: point });
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      console.error('[DrawingCanvas] Failed to get 2D context');
      return;
    }
    
    console.log('[DrawingCanvas] Setting up context style:', { color: drawingState.color, lineWidth: drawingState.lineWidth });
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = drawingState.color;
    ctx.lineWidth = drawingState.lineWidth;
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint || !canvasRef.current) return;
    console.log('[DrawingCanvas] Mouse Move Event:', e.nativeEvent.offsetX, e.nativeEvent.offsetY, 'isDrawing:', isDrawing);
    
    e.stopPropagation();
    e.preventDefault();
    
    const point = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    };
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    console.log('[DrawingCanvas] Drawing with tool:', drawingState.tool);
    switch (drawingState.tool) {
      case 'pencil':
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = drawingState.color;
        ctx.lineWidth = drawingState.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        console.log('[DrawingCanvas] Pencil stroke drawn');
        break;
      case 'eraser':
        ctx.clearRect(
          point.x - drawingState.lineWidth * 5,
          point.y - drawingState.lineWidth * 5,
          drawingState.lineWidth * 10,
          drawingState.lineWidth * 10
        );
        console.log('[DrawingCanvas] Eraser area cleared');
        break;
    }
    
    setLastPoint(point);
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('[DrawingCanvas] Mouse Up Event:', e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    if (!isDrawing || !lastPoint || !canvasRef.current) {
      setIsDrawing(false);
      setLastPoint(null);
      return;
    }
    
    e.stopPropagation();
    e.preventDefault();
    
    const point = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    };
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    console.log('[DrawingCanvas] Finalizing shape with tool:', drawingState.tool);
    // Handle shape tools
    switch (drawingState.tool) {
      case 'line':
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = drawingState.color;
        ctx.lineWidth = drawingState.lineWidth;
        ctx.stroke();
        break;
      case 'arrow':
        drawArrow(ctx, lastPoint, point, drawingState.color, drawingState.lineWidth);
        break;
      case 'rectangle':
        ctx.beginPath();
        ctx.rect(
          lastPoint.x,
          lastPoint.y,
          point.x - lastPoint.x,
          point.y - lastPoint.y
        );
        ctx.strokeStyle = drawingState.color;
        ctx.lineWidth = drawingState.lineWidth;
        ctx.stroke();
        break;
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)
        );
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = drawingState.color;
        ctx.lineWidth = drawingState.lineWidth;
        ctx.stroke();
        break;
      case 'star':
        drawStar(ctx, lastPoint.x, lastPoint.y, 5, 
          Math.sqrt(Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)), 
          drawingState.color, drawingState.lineWidth);
        break;
    }
    
    setIsDrawing(false);
    setLastPoint(null);
    console.log('[DrawingCanvas] State after Mouse Up:', { isDrawing: false, lastPoint: null });
  };
  
  const handleMouseLeave = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };
  
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border rounded w-full cursor-crosshair bg-white"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ 
        touchAction: 'none',
        display: 'block',
        pointerEvents: 'all' // Set pointer events correctly
      }}
    />
  );
};

// Helper component to log when the drawing area becomes active
const EffectLogger = ({ active }: { active: boolean }) => {
  useEffect(() => {
    if (active) {
      console.log('[Popup] Drawing Toolbar and Canvas rendered.');
    }
  }, [active]);
  return null; // This component doesn't render anything visible
};

export const DraggableNotificationsPanel = ({
  isOpen,
  onClose,
  businessLogoUrl = 'https://via.placeholder.com/32/007bff/ffffff?text=Logo', // Default placeholder logo
  currentUserId = 'user_abc', // Example user ID
  availableStaff = [ { id: 'staff1', name: 'Alice' }, { id: 'staff2', name: 'Bob' }] // Example staff
}: DraggableNotificationsPanelProps) => {
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
  
  // --- Effects for Layout & Resize (mostly unchanged) ---
  useEffect(() => { /* Layout adjustment effect */ }, [isPinned, isOpen, panelSize, customWidth]);
  useEffect(() => { /* Initial layout setup */ }, []);
  useEffect(() => { /* Resize handle effect */ }, []);
  useEffect(() => { /* Auto-resize on team tab */ }, [activeTab, panelSize]);


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
  const notificationCounts = { all: 98, team: 5, trades: 9, calendar: 3, comments: 6, account: 0, security: 0 };


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
  
  // Placeholder for drawing
  const handleToggleDrawing = () => {
    const nextIsDrawingActive = !isDrawingActive;
    setIsDrawingActive(nextIsDrawingActive);
    setDrawingState(prev => ({ ...prev, isActive: nextIsDrawingActive }));
    if (!nextIsDrawingActive) {
      setDrawingPreviewUrl(null);
      setUploadedFiles(prev => prev.filter(f => f.type !== 'drawing'));
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

    // Create a ref to track if the component is mounted
    const isMountedRef = useRef(true);
    
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
      // Mark component as unmounted to prevent state updates
      isMountedRef.current = false;
      document.removeEventListener('click', listener);
      // Ensure cursor is reset if component unmounts while mode is active
      if (tagDropModeActive) {
          console.log('[TagDropEffect] Cleanup: Resetting cursor.'); // Log cursor reset
          document.body.style.cursor = '';
      }
    };
  }, [tagDropModeActive, handlePlaceNewTag]); 

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
  
  // Create refs for current values (we'll update these manually)
  const currentIsDrawing = useRef(false);
  const currentLastPoint = useRef<Point | null>(null);
  const currentDrawingState = useRef(drawingState);
  
  // Drawing functions
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // If we're dragging the popup, don't start drawing
    if (isDraggingPopup) return;
    
    const canvas = drawingState.isDrawingOnPage ? pageCanvasRef.current : tagCanvasRef.current;
    if (!canvas) return;
    
    // These are critical to prevent the popup from being dragged when drawing on the canvas
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    setIsDrawing(true);
    setLastPoint(point);
    
    // Start path for pencil tool
    if (drawingState.tool === 'pencil') {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = drawingState.color;
      ctx.lineWidth = drawingState.lineWidth;
    }
  }, [drawingState, isDraggingPopup]);
  
  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return;
    
    // These are critical to prevent the popup from being dragged when drawing on the canvas
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
    
    const canvas = drawingState.isDrawingOnPage ? pageCanvasRef.current : tagCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    switch (drawingState.tool) {
      case 'pencil':
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = drawingState.color;
        ctx.lineWidth = drawingState.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        break;
      case 'eraser':
        ctx.clearRect(
          point.x - drawingState.lineWidth * 5,
          point.y - drawingState.lineWidth * 5,
          drawingState.lineWidth * 10,
          drawingState.lineWidth * 10
        );
        break;
    }
    
    setLastPoint(point);
  }, [isDrawing, lastPoint, drawingState]);
  
  const endDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // These are critical to prevent the popup from being dragged when drawing on the canvas
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
    
    if (!isDrawing || !lastPoint) {
      setIsDrawing(false);
      setLastPoint(null);
      return;
    }
    
    const canvas = drawingState.isDrawingOnPage ? pageCanvasRef.current : tagCanvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const endPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Handle shape tools that draw on mouse up
    switch (drawingState.tool) {
      case 'line':
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.strokeStyle = drawingState.color;
        ctx.lineWidth = drawingState.lineWidth;
        ctx.stroke();
        break;
      case 'arrow':
        drawArrow(ctx, lastPoint, endPoint, drawingState.color, drawingState.lineWidth);
        break;
      case 'rectangle':
        ctx.beginPath();
        ctx.rect(
          lastPoint.x,
          lastPoint.y,
          endPoint.x - lastPoint.x,
          endPoint.y - lastPoint.y
        );
        ctx.strokeStyle = drawingState.color;
        ctx.lineWidth = drawingState.lineWidth;
        ctx.stroke();
        break;
      case 'circle': {
        const radius = Math.sqrt(
          Math.pow(endPoint.x - lastPoint.x, 2) + Math.pow(endPoint.y - lastPoint.y, 2)
        );
        ctx.beginPath();
        ctx.arc(lastPoint.x, lastPoint.y, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = drawingState.color;
        ctx.lineWidth = drawingState.lineWidth;
        ctx.stroke();
        break;
      }
      case 'star':
        drawStar(ctx, lastPoint.x, lastPoint.y, 5, 
          Math.sqrt(Math.pow(endPoint.x - lastPoint.x, 2) + Math.pow(endPoint.y - lastPoint.y, 2)), 
          drawingState.color, drawingState.lineWidth);
        break;
    }
    
    setIsDrawing(false);
    setLastPoint(null);
  }, [isDrawing, lastPoint, drawingState]);
  
  // Helper function to draw arrow
  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    from: Point,
    to: Point,
    color: string,
    lineWidth: number
  ) => {
    const headLength = 10;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    
    // Draw main line
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    
    // Draw arrow head
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headLength * Math.cos(angle - Math.PI / 6),
      to.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      to.x - headLength * Math.cos(angle + Math.PI / 6),
      to.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };
  
  // Helper function to draw star
  const drawStar = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    points: number,
    radius: number,
    color: string,
    lineWidth: number
  ) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    
    const angle = Math.PI / points;
    
    for (let i = 0; i < 2 * points; i++) {
      const r = i % 2 === 0 ? radius : radius / 2;
      const x = centerX + r * Math.cos(i * angle - Math.PI / 2);
      const y = centerY + r * Math.sin(i * angle - Math.PI / 2);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.stroke();
  };
  
  // Set up page-wide canvas when drawing on page
  useEffect(() => {
    // Only log when the effect is actually creating or cleaning up
    if (drawingState.isDrawingOnPage) {
      console.log('[FullPage Draw Effect] Creating overlay canvas and controls...');
    }

    // Cleanup function for previous canvas if it exists
    const cleanup = () => {
      if (canvasContainerRef.current && canvasContainerRef.current.parentNode) {
        console.log('[FullPage Draw Effect] Cleanup: Removing previous canvas...');
        canvasContainerRef.current.parentNode.removeChild(canvasContainerRef.current);
        pageCanvasRef.current = null;
        canvasContainerRef.current = null;
      }
    };

    // Clean up any existing canvas before creating a new one
    cleanup();

    if (drawingState.isDrawingOnPage) {
      // Create a full-page canvas overlay for drawing
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100vw';
      container.style.height = '100vh';
      container.style.zIndex = '9999'; 
      container.style.pointerEvents = 'all';
      container.classList.add('drawing-overlay');
      
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.cursor = 'crosshair';
      canvas.style.pointerEvents = 'all'; 
      
      const controls = document.createElement('div');
      controls.style.position = 'fixed';
      controls.style.bottom = '20px';
      controls.style.left = '50%';
      controls.style.transform = 'translateX(-50%)';
      controls.style.backgroundColor = '#fff';
      controls.style.padding = '10px';
      controls.style.borderRadius = '8px';
      controls.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      controls.style.display = 'flex';
      controls.style.gap = '10px';
      controls.style.zIndex = '10000'; 
      controls.innerHTML = `
        <button class="drawing-done-btn px-4 py-2 bg-blue-600 text-white rounded">Done</button>
        <button class="drawing-cancel-btn px-4 py-2 bg-gray-300 text-gray-700 rounded">Cancel</button>
      `;
      
      // CORRECTED toolsbar.innerHTML
      const toolsbar = document.createElement('div');
      toolsbar.style.position = 'fixed';
      toolsbar.style.top = '20px';
      toolsbar.style.left = '50%';
      toolsbar.style.transform = 'translateX(-50%)';
      toolsbar.style.backgroundColor = '#fff';
      toolsbar.style.padding = '8px';
      toolsbar.style.borderRadius = '8px';
      toolsbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      toolsbar.style.display = 'flex';
      toolsbar.style.alignItems = 'center';
      toolsbar.style.gap = '8px';
      toolsbar.style.zIndex = '10000';
      toolsbar.innerHTML = `
        <div class="tool-group" style="display: flex; gap: 4px; border-right: 1px solid #ddd; padding-right: 8px;">
          <button class="tool-btn pencil ${currentDrawingState.current.tool === 'pencil' ? 'active' : ''}" title="Pencil" style="width: 32px; height: 32px; border-radius: 4px; display: flex; align-items: center; justify-content: center; ${currentDrawingState.current.tool === 'pencil' ? 'background-color: #e6f0ff; border: 1px solid #3b82f6;' : 'background-color: #f1f5f9; border: 1px solid #ddd;'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
          </button>
          <button class="tool-btn eraser ${drawingStateRef.current.tool === 'eraser' ? 'active' : ''}" title="Eraser" style="width: 32px; height: 32px; border-radius: 4px; display: flex; align-items: center; justify-content: center; ${drawingStateRef.current.tool === 'eraser' ? 'background-color: #e6f0ff; border: 1px solid #3b82f6;' : 'background-color: #f1f5f9; border: 1px solid #ddd;'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20H7L3 16c-1.5-1.45-1.5-3.55 0-5l6.5-6.5c1.45-1.5 3.55-1.5 5 0l7 7c1.5 1.45 1.5 3.55 0 5L20 18"></path></svg>
          </button>
        </div>
        <div class="tool-group" style="display: flex; gap: 4px; border-right: 1px solid #ddd; padding-right: 8px;">
          <button class="tool-btn line ${drawingStateRef.current.tool === 'line' ? 'active' : ''}" title="Line" style="width: 32px; height: 32px; border-radius: 4px; display: flex; align-items: center; justify-content: center; ${drawingStateRef.current.tool === 'line' ? 'background-color: #e6f0ff; border: 1px solid #3b82f6;' : 'background-color: #f1f5f9; border: 1px solid #ddd;'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>
          </button>
          <button class="tool-btn arrow ${drawingStateRef.current.tool === 'arrow' ? 'active' : ''}" title="Arrow" style="width: 32px; height: 32px; border-radius: 4px; display: flex; align-items: center; justify-content: center; ${drawingStateRef.current.tool === 'arrow' ? 'background-color: #e6f0ff; border: 1px solid #3b82f6;' : 'background-color: #f1f5f9; border: 1px solid #ddd;'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
          <button class="tool-btn rectangle ${drawingStateRef.current.tool === 'rectangle' ? 'active' : ''}" title="Rectangle" style="width: 32px; height: 32px; border-radius: 4px; display: flex; align-items: center; justify-content: center; ${drawingStateRef.current.tool === 'rectangle' ? 'background-color: #e6f0ff; border: 1px solid #3b82f6;' : 'background-color: #f1f5f9; border: 1px solid #ddd;'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect></svg>
          </button>
          <button class="tool-btn circle ${drawingStateRef.current.tool === 'circle' ? 'active' : ''}" title="Circle" style="width: 32px; height: 32px; border-radius: 4px; display: flex; align-items: center; justify-content: center; ${drawingStateRef.current.tool === 'circle' ? 'background-color: #e6f0ff; border: 1px solid #3b82f6;' : 'background-color: #f1f5f9; border: 1px solid #ddd;'}">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
          </button>
        </div>
        <div class="tool-group" style="display: flex; gap: 4px; border-right: 1px solid #ddd; padding-right: 8px;">
          <select class="brush-width" style="padding: 4px; border-radius: 4px; border: 1px solid #ddd;">
            <option value="1" ${drawingStateRef.current.lineWidth === 1 ? 'selected' : ''}>Thin</option>
            <option value="3" ${drawingStateRef.current.lineWidth === 3 ? 'selected' : ''}>Normal</option>
            <option value="5" ${drawingStateRef.current.lineWidth === 5 ? 'selected' : ''}>Thick</option>
            <option value="10" ${drawingStateRef.current.lineWidth === 10 ? 'selected' : ''}>Extra Thick</option>
          </select>
        </div>
        <div class="color-pickers" style="display: flex; gap: 4px;">
          ${['#FF0000', '#000000', '#FFFFFF', '#CCCCCC', '#888888', '#FFFF00', '#00FF00', '#0000FF'].map(color => 
            `<button class="color-btn" data-color="${color}" style="width: 24px; height: 24px; border-radius: 50%; background-color: ${color}; border: ${drawingStateRef.current.color === color ? '2px solid #3b82f6' : '1px solid #ddd'}; ${color === '#FFFFFF' ? 'border: 1px solid #ddd;' : ''}"></button>`
          ).join('')}
        </div>
      `;
      
      container.appendChild(canvas);
      container.appendChild(controls);
      container.appendChild(toolsbar);
      document.body.appendChild(container);
      
      canvasContainerRef.current = container;
      pageCanvasRef.current = canvas;

      // Add event listeners for drawing - USE REFS HERE
      const mouseDownListener = (e: MouseEvent) => {
        if (!canvas || !canvas.parentNode) return; // Check if canvas still exists
        console.log('[FullPage Canvas] Mouse Down Event', e.clientX, e.clientY);
        e.preventDefault();
        e.stopPropagation();
        
        const point = {
          x: e.clientX,
          y: e.clientY
        };
        setIsDrawing(true); 
        setLastPoint(point); 
        
        if (drawingStateRef.current.tool === 'pencil') {
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = drawingStateRef.current.color;
          ctx.lineWidth = drawingStateRef.current.lineWidth;
        }
      };
      
      const mouseMoveListener = (e: MouseEvent) => {
        if (!canvas || !canvas.parentNode || !isDrawingRef.current || !lastPointRef.current) return;
        console.log('[FullPage Canvas] Mouse Move Event', e.clientX, e.clientY);
        
        e.preventDefault();
        e.stopPropagation();
        
        const point = {
          x: e.clientX,
          y: e.clientY
        };
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        switch (drawingStateRef.current.tool) {
          case 'pencil':
            ctx.beginPath();
            ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
            ctx.lineTo(point.x, point.y);
            ctx.strokeStyle = drawingStateRef.current.color;
            ctx.lineWidth = drawingStateRef.current.lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            break;
          case 'eraser':
             ctx.clearRect(
              point.x - drawingStateRef.current.lineWidth * 5,
              point.y - drawingStateRef.current.lineWidth * 5,
              drawingStateRef.current.lineWidth * 10,
              drawingStateRef.current.lineWidth * 10
            );
            break;
        }
        
        setLastPoint(point); 
      };
      
      const mouseUpListener = (e: MouseEvent) => {
        if (!canvas || !canvas.parentNode) return;
        console.log('[FullPage Canvas] Mouse Up/Leave Event', e.clientX, e.clientY);
        
        if (!isDrawingRef.current || !lastPointRef.current) {
          setIsDrawing(false); 
          setLastPoint(null); 
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        const endPoint = {
          x: e.clientX,
          y: e.clientY
        };
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const currentTool = drawingStateRef.current.tool;
        const currentLastPoint = lastPointRef.current;
        const currentColor = drawingStateRef.current.color;
        const currentLineWidth = drawingStateRef.current.lineWidth;
        
        // Redraw the switch statement for drawing shapes using refs
        switch (currentTool) {
          case 'line':
            ctx.beginPath();
            ctx.moveTo(currentLastPoint.x, currentLastPoint.y);
            ctx.lineTo(endPoint.x, endPoint.y);
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentLineWidth;
            ctx.stroke();
            break;
          case 'arrow':
            drawArrow(ctx, currentLastPoint, endPoint, currentColor, currentLineWidth);
            break;
          case 'rectangle':
            ctx.beginPath();
            ctx.rect(
              currentLastPoint.x,
              currentLastPoint.y,
              endPoint.x - currentLastPoint.x,
              endPoint.y - currentLastPoint.y
            );
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentLineWidth;
            ctx.stroke();
            break;
          case 'circle': {
            const radius = Math.sqrt(
              Math.pow(endPoint.x - currentLastPoint.x, 2) + Math.pow(endPoint.y - currentLastPoint.y, 2)
            );
            ctx.beginPath();
            ctx.arc(currentLastPoint.x, currentLastPoint.y, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentLineWidth;
            ctx.stroke();
            break;
          }
          case 'star':
            drawStar(ctx, currentLastPoint.x, currentLastPoint.y, 5, 
                Math.sqrt(Math.pow(endPoint.x - currentLastPoint.x, 2) + Math.pow(endPoint.y - currentLastPoint.y, 2)), 
                currentColor, currentLineWidth);
            break;
        }
        
        setIsDrawing(false); 
        setLastPoint(null); 
      };
      
      canvas.addEventListener('mousedown', mouseDownListener);
      canvas.addEventListener('mousemove', mouseMoveListener);
      canvas.addEventListener('mouseup', mouseUpListener);
      canvas.addEventListener('mouseleave', mouseUpListener);

      // Return cleanup function
      return () => {
        console.log('[FullPage Draw Effect] Cleanup: Removing event listeners and canvas...');
        canvas.removeEventListener('mousedown', mouseDownListener);
        canvas.removeEventListener('mousemove', mouseMoveListener);
        canvas.removeEventListener('mouseup', mouseUpListener);
        canvas.removeEventListener('mouseleave', mouseUpListener);
        cleanup();
      };
    }
  }, [drawingState.isDrawingOnPage]); // Only depend on isDrawingOnPage
  
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
  
  // Handle tool changes
  const handleToolChange = (tool: DrawingState['tool']) => {
    setDrawingState(prev => ({...prev, tool}));
  };
  
  const handleBrushSizeChange = (size: number) => {
    setDrawingState(prev => ({...prev, lineWidth: size}));
  };
  
  const handleColorChange = (color: string) => {
    setDrawingState(prev => ({...prev, color}));
  };
  
  // Toggle drawing on the entire page
  const handleTogglePageDrawing = () => {
    setDrawingState(prev => ({
      ...prev,
      isActive: true,
      isDrawingOnPage: !prev.isDrawingOnPage
    }));
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

  useEffect(() => {
    if (isDrawing && tagCanvasRef.current) {
      const ctx = tagCanvasRef.current.getContext('2d');
      ctx.lineWidth = drawingState.lineWidth;
      ctx.strokeStyle = drawingState.color;
      ctx.lineCap = 'round';
    }
  }, [isDrawing, drawingState.lineWidth, drawingState.color]);

  const drawPencil = (ctx: CanvasRenderingContext2D, startPoint: Point, endPoint: Point) => {
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();
  };

  const eraseArea = (ctx: CanvasRenderingContext2D, point: Point, size: number) => {
    ctx.clearRect(point.x - size, point.y - size, size * 2, size * 2);
  };

  // Similar functions for other tools

  const [tagCoordinates, setTagCoordinates] = useState<TagPopupPosition>({ x: 0, y: 0 });
  const [showTagPopup, setShowTagPopup] = useState(false);

  // --- Tag Drop Effect ---
  useEffect(() => {
    if (isDevelopment) console.log('[TagDropEffect] Running effect. Mode active:', tagDropModeActive);
    
    if (tagDropModeActive) {
      // Add click listener to the document
      document.addEventListener('click', handlePlaceNewTag);
      
      // Add a class to the body to indicate tag drop mode
      document.body.classList.add('tag-drop-mode-active');
      
      return () => {
        if (isDevelopment) console.log('[TagDropEffect] Removing click listener.');
        document.removeEventListener('click', handlePlaceNewTag);
        document.body.classList.remove('tag-drop-mode-active');
      };
    } else {
      // Clean up any existing listeners
      document.removeEventListener('click', handlePlaceNewTag);
      document.body.classList.remove('tag-drop-mode-active');
      
      return () => {
        if (isDevelopment) console.log('[TagDropEffect] Cleanup: Removing click listener.');
      };
    }
  }, [tagDropModeActive, handlePlaceNewTag, isDevelopment]);

  // Defensive: On mouseup anywhere, always stop dragging
  useEffect(() => {
    const stopDrag = () => setIsDraggingPopup(false);
    document.addEventListener('mouseup', stopDrag);
    return () => document.removeEventListener('mouseup', stopDrag);
  }, []);

  // --- Full-page Drawing Overlay ---
  // Add a callback to handle Done/Cancel
  const handleFullPageDrawingDone = () => {
    if (pageCanvasRef.current) {
      const url = pageCanvasRef.current.toDataURL('image/png');
      setDrawingPreviewUrl(url);
      setUploadedFiles(prev => {
        const others = prev.filter(f => f.type !== 'drawing');
        return [
          ...others,
          {
            file: dataURLtoFile(url, 'drawing.png')!,
            previewUrl: url,
            type: 'drawing',
          },
        ];
      });
    }
    setDrawingState(prev => ({ ...prev, isDrawingOnPage: false, isActive: false }));
    setIsDrawingActive(false);
  };
  const handleFullPageDrawingCancel = () => {
    setDrawingState(prev => ({ ...prev, isDrawingOnPage: false, isActive: false }));
    setIsDrawingActive(false);
  };
  // ... existing code ...
  // In the full-page drawing overlay effect, wire up the buttons
  useEffect(() => {
    if (!drawingState.isDrawingOnPage || !canvasContainerRef.current) return;
    const doneBtn = canvasContainerRef.current.querySelector('.drawing-done-btn');
    const cancelBtn = canvasContainerRef.current.querySelector('.drawing-cancel-btn');
    if (doneBtn) doneBtn.addEventListener('click', handleFullPageDrawingDone);
    if (cancelBtn) cancelBtn.addEventListener('click', handleFullPageDrawingCancel);
    return () => {
      if (doneBtn) doneBtn.removeEventListener('click', handleFullPageDrawingDone);
      if (cancelBtn) cancelBtn.removeEventListener('click', handleFullPageDrawingCancel);
    };
  }, [drawingState.isDrawingOnPage]);
  // ... existing code ...
  // When drawing is finished in the popup, update preview
  const handleDrawingFinish = () => {
    if (tagCanvasRef.current) {
      const url = tagCanvasRef.current.toDataURL('image/png');
      setDrawingPreviewUrl(url);
      // Add/replace drawing in uploadedFiles
      setUploadedFiles(prev => {
        const others = prev.filter(f => f.type !== 'drawing');
        return [
          ...others,
          {
            file: dataURLtoFile(url, 'drawing.png')!,
            previewUrl: url,
            type: 'drawing',
          },
        ];
      });
    }
  };

  return (
    <>
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
                          <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col gap-3">
                              {/* Row 1: Tools & Brush Options */}
                              <div className="flex items-center gap-4">
                                  {/* Tools Section */}
                                  <div className="flex items-center gap-1 border-r pr-3">
                                      <span className="text-xs font-medium mr-1">Tools:</span>
                                      <Button 
                                          variant={drawingState.tool === 'pencil' ? 'default' : 'ghost'} 
                                          size="icon" 
                                          className="h-7 w-7" 
                                          title="Pencil"
                                          onClick={() => setDrawingState(prev => ({ ...prev, tool: 'pencil' }))}
                                      >
                                          <Edit3 className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                          variant={drawingState.tool === 'eraser' ? 'default' : 'ghost'} 
                                          size="icon" 
                                          className="h-7 w-7" 
                                          title="Eraser"
                                          onClick={() => setDrawingState(prev => ({ ...prev, tool: 'eraser' }))}
                                      >
                                          <Trash2 className="h-4 w-4" />
                                      </Button>
                                  </div>
                                  {/* Brush Section */}
                                  <div className="flex items-center gap-1">
                                      <span className="text-xs font-medium mr-1">Brush:</span>
                                      <select 
                                          className="text-xs border rounded px-1 py-0.5"
                                          value={drawingState.lineWidth}
                                          onChange={(e) => setDrawingState(prev => ({ ...prev, lineWidth: Number(e.target.value) }))}
                                      >
                                          <option value="1">Thin</option>
                                          <option value="3">Normal</option>
                                          <option value="5">Thick</option>
                                          <option value="10">Extra Thick</option>
                                      </select>
                                  </div>
                              </div>

                              {/* Row 2: Shapes & Colors */}
                              <div className="flex items-center gap-4">
                                  {/* Shapes Section */}
                                  <div className="flex items-center gap-1 border-r pr-3 flex-wrap">
                                      <span className="text-xs font-medium mr-1 w-full mb-1">Shapes:</span>
                                      <Button 
                                          variant={drawingState.tool === 'line' ? 'default' : 'ghost'} 
                                          size="icon" 
                                          className="h-6 w-6"
                                          onClick={() => setDrawingState(prev => ({ ...prev, tool: 'line' }))}
                                      >
                                          <Minus className="h-4 w-4"/>
                                      </Button>
                                      <Button 
                                          variant={drawingState.tool === 'arrow' ? 'default' : 'ghost'} 
                                          size="icon" 
                                          className="h-6 w-6"
                                          onClick={() => setDrawingState(prev => ({ ...prev, tool: 'arrow' }))}
                                      >
                                          <MoveUpRight className="h-4 w-4"/>
                                      </Button>
                                      <Button 
                                          variant={drawingState.tool === 'rectangle' ? 'default' : 'ghost'} 
                                          size="icon" 
                                          className="h-6 w-6"
                                          onClick={() => setDrawingState(prev => ({ ...prev, tool: 'rectangle' }))}
                                      >
                                          <Square className="h-4 w-4"/>
                                      </Button>
                                      <Button 
                                          variant={drawingState.tool === 'circle' ? 'default' : 'ghost'} 
                                          size="icon" 
                                          className="h-6 w-6"
                                          onClick={() => setDrawingState(prev => ({ ...prev, tool: 'circle' }))}
                                      >
                                          <Circle className="h-4 w-4"/>
                                      </Button>
                                      <Button 
                                          variant={drawingState.tool === 'star' ? 'default' : 'ghost'} 
                                          size="icon" 
                                          className="h-6 w-6"
                                          onClick={() => setDrawingState(prev => ({ ...prev, tool: 'star' }))}
                                      >
                                          <Star className="h-4 w-4"/>
                                      </Button>
                                  </div>
                                  {/* Colors Section */}
                                  <div className="flex items-center gap-1 flex-wrap">
                                      <span className="text-xs font-medium mr-1 w-full mb-1">Colors:</span>
                                      {['#FF0000', '#000000', '#FFFFFF', '#CCCCCC', '#888888', '#FFFF00', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF'].map(color => (
                                          <Button 
                                              key={color} 
                                              variant="outline" 
                                              size="icon" 
                                              className={cn(
                                                  "h-5 w-5 p-0 border rounded-full", 
                                                  drawingState.color === color ? "ring-2 ring-offset-1 ring-blue-500" : ""
                                              )} 
                                              style={{ backgroundColor: color }} 
                                              title={color}
                                              onClick={() => setDrawingState(prev => ({ ...prev, color }))}
                                          />
                                      ))}
                                  </div>
                              </div>

                              {/* Row 3: Canvas and Drawing Outside the Tag */}
                              <div className="mt-2">
                                  <DrawingCanvas 
                                      width={340} 
                                      height={200} 
                                      drawingState={drawingState} 
                                      canvasRef={tagCanvasRef}
                                      drawArrow={drawArrow}
                                      drawStar={drawStar}
                                  />
                                  {/* Save Drawing Button */}
                                  <Button
                                      variant="outline"
                                      size="sm"
                                      className="mt-2 w-full text-xs"
                                      onClick={handleDrawingFinish}
                                  >
                                      <Save className="h-3.5 w-3.5 mr-1" />
                                      Save Drawing to Attachments
                                  </Button>
                                  {/* Draw Outside Tag Button */}
                                  <Button
                                      variant="outline"
                                      size="sm"
                                      className="mt-2 w-full text-xs"
                                      onClick={() => setDrawingState(prev => ({ ...prev, isDrawingOnPage: true }))}
                                  >
                                      <Brush className="h-3.5 w-3.5 mr-1" />
                                      Draw Outside Tag (Full Page)
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
          isOpen ? "" : "hidden", // Use hidden class when not open
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