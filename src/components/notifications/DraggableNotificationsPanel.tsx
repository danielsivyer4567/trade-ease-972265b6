import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Bell, Maximize2, Minimize2, ArrowLeftRight, Pin, Calendar, MessageSquare, Tag, Edit3, Image, Save, Mic, Trash2, Brush, AlertCircle, Minus, MoveUpRight, Square, Circle, Star, Search, Settings, Users, Hash, Activity, CheckCircle, XCircle, Upload, Palette, Video, ArrowUp, Highlighter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './NotificationItem';
import { DraggableProfileBubble } from './DraggableProfileBubble';
import { cn } from '@/lib/utils';
import { useNotifications, type Notification } from './NotificationContextProvider';
import { createTag, type TagData } from '@/services/tagService';
import { toast } from 'sonner';
import { DrawingState } from './types';
import { useAuth } from '@/contexts/AuthContext';
// Drawing canvas removed - only full-page drawing is available

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
  type: 'image' | 'audio' | 'drawing' | 'video';
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

// Real Supabase upload function
const uploadFileToSupabase = async (file: File, folder: string, fileName: string): Promise<string> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  const filePath = `${folder}/${fileName}`;
  const { data, error } = await supabase.storage
    .from('attachments')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Upload failed:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('attachments')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const DraggableNotificationsPanel = ({
  isOpen,
  onClose,
  businessLogoUrl = '/business-logo.png',
  currentUserId,
  availableStaff
}: DraggableNotificationsPanelProps) => {
  // Get user from auth context
  const { user } = useAuth();
  
  // Remove debug logging and test override
  const effectiveIsOpen = isOpen;
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [panelSize, setPanelSize] = useState<PanelSize>('quarter');
  const [isPinned, setIsPinned] = useState(false);
  const [customWidth, setCustomWidth] = useState(350);
  const [isDrawingMode, setIsDrawingMode] = useState(false); // General panel drawing mode
  const [isMouseOverPaintMenu, setIsMouseOverPaintMenu] = useState(false); // Track mouse over paint menu
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isActive: false,
    tool: 'pencil',
    color: '#FFFF00', // Default to yellow highlighter
    lineWidth: 8,
    isDrawingOnPage: false
  });
  
  // Enhanced drawing tools state
  const [selectedShape, setSelectedShape] = useState<'pencil' | 'circle' | 'rectangle' | 'arrow' | 'highlight'>('highlight');
  const highlightColors = ['#FFFF00', '#00FF00', '#FF00FF', '#00FFFF', '#FFA500', '#FF0000'];
  const standardColors = ['#000000', '#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#FF00FF'];
  const [sortLater, setSortLater] = useState<string[]>([]);
  
  // --- Tag Drop State ---
  const [tagDropModeActive, setTagDropModeActive] = useState(false);
  const [isTagPopupOpen, setIsTagPopupOpen] = useState(false);
  const [tagPopupCoords, setTagPopupCoords] = useState<TagPopupPosition | null>(null);
  const [tagMarkers, setTagMarkers] = useState<TagMarker[]>([]);
  const activeTagPopupElement = useRef<HTMLDivElement | null>(null);
  
  // --- Draggable Bubble State ---
  const [isDraggingBubble, setIsDraggingBubble] = useState(false);
  
  // Add drag state for the tag popup
  const [isDraggingPopup, setIsDraggingPopup] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // --- State for within the Tag Popup ---
  const [tagComment, setTagComment] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isRecordingScreen, setIsRecordingScreen] = useState(false);
  // Drawing is now only available in full-page mode
  const [staffSelectionError, setStaffSelectionError] = useState<string | null>(null);
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null);
  const [screenRecorder, setScreenRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [requiresApproval, setRequiresApproval] = useState(false);
  
  const panelRef = useRef<HTMLDivElement>(null);
  const leftResizeHandleRef = useRef<HTMLDivElement>(null);
  // Canvas ref removed - only full-page drawing is available
  // Ref to track if component is mounted (for cleanup)
  const isMountedRef = useRef(true);
  const { notifications, markAllAsRead, replyToNotification, getConversationNotifications } = useNotifications(); // Assuming this context provides notifications

  const SIDEBAR_WIDTH = 50;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
  
  // NEW: Store the preview URL of the drawing
  const [drawingPreviewUrl, setDrawingPreviewUrl] = useState<string | null>(null);
  
  // Conversation threading state
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [replyToNotificationId, setReplyToNotificationId] = useState<string | number | null>(null);

  // Resets the state associated with the tag popup content
  const resetTagPopupState = useCallback(() => {
    setTagComment('');
    setSelectedStaff([]);
    // Clean up uploaded files URLs
    uploadedFiles.forEach(file => {
      if (file.previewUrl && file.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(file.previewUrl);
      }
    });
    setUploadedFiles([]);
    setIsRecordingAudio(false);
    // Drawing state cleanup removed
    setStaffSelectionError(null);
    setTagPopupCoords(null);
    setDrawingPreviewUrl(null);
    setActiveConversationId(null);
    setIsReplyMode(false);
    setReplyToNotificationId(null);
    // Clean up audio recording
    if (audioRecorder && audioRecorder.state === 'recording') {
      audioRecorder.stop();
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
    }
    setAudioRecorder(null);
    setAudioStream(null);
  }, [uploadedFiles, audioRecorder, audioStream]);

  // Handle reply to notification
  const handleReplyToNotification = useCallback((notificationId: string | number) => {
    if (!notifications || notifications.length === 0) return;
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;
    
    setReplyToNotificationId(notificationId);
    setIsReplyMode(true);
    
    // If the notification has a conversation ID, use it; otherwise create one
    const conversationId = notification.conversationId || `conv_${notificationId}`;
    setActiveConversationId(conversationId);
    
    // Pre-populate with selected staff if replying to a tag
    if (notification.senderId && availableStaff && availableStaff.length > 0) {
      const sender = availableStaff.find(staff => staff.id === notification.senderId);
      if (sender) {
        setSelectedStaff([sender]);
      }
    }
    
    // Open the tag popup at the original coordinates or center
    const coords = notification.coordinates || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    setTagPopupCoords(coords);
    setIsTagPopupOpen(true);
  }, [notifications, availableStaff]);

  // Forward declare closeTagPopup to avoid initialization issues
  const closeTagPopup = useCallback(() => {
    setIsTagPopupOpen(false);
    resetTagPopupState();
    document.body.style.cursor = tagDropModeActive ? 'crosshair' : '';
  }, [tagDropModeActive, resetTagPopupState]);

  // --- Cleanup active popup if panel closes ---
  useEffect(() => {
    if (!effectiveIsOpen && isTagPopupOpen) {
      closeTagPopup();
    }
  }, [effectiveIsOpen, isTagPopupOpen, closeTagPopup]);


  // --- Panel Control Functions ---
  const togglePin = () => setIsPinned(!isPinned);
  const togglePanelSize = () => setPanelSize(prev => prev === 'minimized' ? 'quarter' : prev === 'quarter' ? 'half' : 'quarter');
  const minimizePanel = () => setPanelSize('minimized');
  const addToSortLater = (id: string) => setSortLater(prev => [...prev, id]);
  const toggleGeneralDrawingMode = () => setIsDrawingMode(!isDrawingMode);

  const showOverlay = effectiveIsOpen && !isPinned;
  
  // Calculate real notification counts
  const notificationCounts = {
    all: notifications?.length || 0,
    team: notifications?.filter(n => n.type === 'team').length || 0,
    trades: notifications?.filter(n => ['job', 'quote', 'payment'].includes(n.type)).length || 0,
    calendar: notifications?.filter(n => n.type === 'calendar').length || 0,
    comments: notifications?.filter(n => ['message', 'comment', 'tag'].includes(n.type)).length || 0,
    account: notifications?.filter(n => n.type === 'account').length || 0,
    security: notifications?.filter(n => n.type === 'security').length || 0
  };


  // --- Tag Drop Core Logic ---

  // Toggles the overall Tag Drop mode on/off
  const toggleTagDropMode = () => {
    setTagDropModeActive(prev => {
      const nextState = !prev;
      if (!nextState) {
        closeTagPopup();
        // Only reset cursor if not in drawing mode
        if (!isDrawingMode) {
          document.body.style.cursor = '';
        }
      } else {
        // Only set crosshair cursor if not in drawing mode
        if (!isDrawingMode) {
          document.body.style.cursor = 'crosshair';
        }
        toast.info('Tag Drop Mode Active - Click anywhere or drag your profile picture to place a tag');
      }
      return nextState;
    });
  };

  // --- Draggable Bubble Handlers ---
  const handleBubbleDragStart = useCallback(() => {
    setIsDraggingBubble(true);
    document.body.style.cursor = 'grabbing';
  }, []);

  const handleBubbleDragEnd = useCallback((x: number, y: number) => {
    setIsDraggingBubble(false);
    document.body.style.cursor = tagDropModeActive ? 'crosshair' : '';
    
    // Calculate popup position with bounds check
    const popupWidth = 320;
    const popupHeight = 380;
    let adjustedX = x;
    let adjustedY = y;
    
    if (adjustedX + popupWidth > window.innerWidth) {
      adjustedX = window.innerWidth - popupWidth - 10;
    }
    if (adjustedY + popupHeight > window.innerHeight) {
      adjustedY = window.innerHeight - popupHeight - 10;
    }
    if (adjustedX < 10) adjustedX = 10;
    if (adjustedY < 10) adjustedY = 10;

    // Set popup position and open
    setTagPopupCoords({ x: adjustedX, y: adjustedY });
    setIsTagPopupOpen(true);
  }, [tagDropModeActive]);

  const handleBubbleDragCancel = useCallback(() => {
    setIsDraggingBubble(false);
    document.body.style.cursor = tagDropModeActive ? 'crosshair' : '';
  }, [tagDropModeActive]);


  // Drawing state removed - only full-page drawing is available


  // Handle click on page to place a new tag (for CREATION) - now only as fallback
  const handlePlaceNewTag = useCallback((event: MouseEvent) => {
    // Don't handle if not in tag drop mode or if currently dragging bubble
    if (!tagDropModeActive || isDraggingBubble) return;

    const target = event.target as HTMLElement;
    
    // Check if clicked on any interactive element including the draggable bubble
    const isInteractive = target.closest(`
      button, 
      [role="button"], 
      a, 
      input, 
      textarea, 
      select, 
      .notification-item, 
      .notifications-panel, 
      .tag-popup-content,
      .draggable-profile-bubble,
      nav,
      .sidebar,
      .menu,
      .dropdown,
      .modal,
      .dialog,
      [data-interactive="true"]
    `);

    // Also check for common UI component class patterns
    const isUIComponent = target.closest(`
      [class*="button"],
      [class*="btn"],
      [class*="menu"],
      [class*="nav"],
      [class*="sidebar"],
      [class*="header"],
      [class*="toolbar"],
      [class*="control"],
      [class*="input"],
      [class*="select"],
      [class*="dropdown"],
      [class*="popup"],
      [class*="modal"],
      [class*="dialog"],
      [class*="tooltip"]
    `);

    if (isInteractive || isUIComponent) {
      return; // Don't place tag on interactive elements
    }

    // Prevent default behavior for this click
    event.preventDefault();
    event.stopPropagation();


    // Calculate popup position with bounds check
    const popupWidth = 320;
    const popupHeight = 380;
    let x = event.clientX;
    let y = event.clientY;
    
    if (x + popupWidth > window.innerWidth) {
      x = window.innerWidth - popupWidth - 10;
    }
    if (y + popupHeight > window.innerHeight) {
      y = window.innerHeight - popupHeight - 10;
    }
    if (x < 10) x = 10;
    if (y < 10) y = 10;

    // Set popup position and open
    setTagPopupCoords({ x, y });
    setIsTagPopupOpen(true);
  }, [tagDropModeActive, isDraggingBubble]);


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
  
  // Drawing functions removed - only full-page drawing is available

  // Enhanced audio recording with hold-to-record functionality
  const handleAudioRecordStart = async () => {
    if (isRecordingAudio) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioFile = new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        
        const newFile: UploadedFile = {
          file: audioFile,
          previewUrl: audioUrl,
          type: 'audio'
        };
        setUploadedFiles(prev => [...prev, newFile]);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
        setAudioRecorder(null);
        toast.success('Audio recorded successfully!');
      };

      mediaRecorder.start();
      setIsRecordingAudio(true);
      setAudioRecorder(mediaRecorder);
      setAudioStream(stream);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Failed to access microphone. Please check your permissions.');
    }
  };

  const handleAudioRecordStop = () => {
    if (audioRecorder && audioRecorder.state === 'recording') {
      audioRecorder.stop();
    }
    setIsRecordingAudio(false);
  };

  // Legacy toggle function for backward compatibility
  const handleToggleAudioRecord = async () => {
    if (!isRecordingAudio) {
      await handleAudioRecordStart();
    } else {
      handleAudioRecordStop();
    }
  };

  const handleToggleScreenRecord = async () => {
    if (!isRecordingScreen) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true, 
          audio: true 
        });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const videoFile = new File([blob], `screen-recording-${Date.now()}.webm`, { type: 'video/webm' });
          const videoUrl = URL.createObjectURL(blob);
          
          const newFile: UploadedFile = {
            file: videoFile,
            previewUrl: videoUrl,
            type: 'video'
          };
          setUploadedFiles(prev => [...prev, newFile]);
          
          // Clean up
          stream.getTracks().forEach(track => track.stop());
          setScreenStream(null);
          setScreenRecorder(null);
        };

        // Stop recording when user stops sharing screen
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length > 0) {
          videoTracks[0].addEventListener('ended', () => {
            if (mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
            }
            setIsRecordingScreen(false);
          });
        }

        mediaRecorder.start();
        setIsRecordingScreen(true);
        setScreenRecorder(mediaRecorder);
        setScreenStream(stream);
        
        // Auto-stop after 5 minutes
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            setIsRecordingScreen(false);
          }
        }, 300000);
        
      } catch (error) {
        console.error('Failed to start screen recording:', error);
        toast.error('Failed to access screen. Please check your permissions.');
      }
    } else {
      // Stop recording
      if (screenRecorder && screenRecorder.state === 'recording') {
        screenRecorder.stop();
      }
      setIsRecordingScreen(false);
    }
  };
  
  const removeUploadedFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    // Clean up blob URLs to prevent memory leaks
    if (fileToRemove.previewUrl && fileToRemove.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }
    // If removing audio/video placeholder, update the respective state
    // Drawing removed from popup
    if (fileToRemove.type === 'audio') setIsRecordingAudio(false);
    if (fileToRemove.type === 'video') setIsRecordingScreen(false);
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // --- Save Tag Logic ---
  const handleSaveTag = async () => {
    if (selectedStaff.length === 0) {
      setStaffSelectionError('You must select at least one staff member to notify.');
      return;
    }
    setStaffSelectionError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Upload files first
      const uploadPromises = uploadedFiles.map(async (uploadedFile, index) => {
        const folderPath = `tag_drops/${currentUserId}/${Date.now()}`;
        let fileName = uploadedFile.file.name;
        if (uploadedFile.type === 'drawing') fileName = `drawing-${Date.now()}.png`;
        if (uploadedFile.type === 'audio') fileName = `recording-${Date.now()}.mp3`;
        
        try {
          const url = await uploadFileToSupabase(uploadedFile.file, folderPath, fileName);
          setUploadProgress(((index + 1) / uploadedFiles.length) * 50); // 50% for uploads
          return { ...uploadedFile, supabaseUrl: url };
        } catch (error) {
          console.error("Upload failed:", error);
          toast.error(`Failed to upload ${fileName}`);
          return { ...uploadedFile, supabaseUrl: undefined };
        }
      });
      
      const uploadedFilesWithUrls = await Promise.all(uploadPromises);
      setUploadProgress(60);

      // 2. Create tag data
      const tagData: Omit<TagData, 'id' | 'timestamp'> = {
        creatorId: currentUserId,
        comment: tagComment,
        taggedStaffIds: selectedStaff.map(s => s.id),
        attachments: uploadedFilesWithUrls
          .filter(f => f.supabaseUrl)
          .map(f => ({ type: f.type, url: f.supabaseUrl! })),
        coords: tagPopupCoords!,
        drawingData: drawingPreviewUrl || undefined,
        conversationId: activeConversationId || undefined,
        replyToId: replyToNotificationId || undefined
      };

      setUploadProgress(80);

      // 3. Save tag to database
      const savedTag = await createTag(tagData);
      setUploadProgress(100);

      // 4. If this is a reply, use the reply function from context
      if (isReplyMode && replyToNotificationId) {
        replyToNotification(replyToNotificationId, tagComment, uploadedFilesWithUrls);
        toast.success('Reply sent successfully!');
      } else {
        // 5. Show success notification for new tag
        toast.success('Tag created successfully!');
      }

      // 6. Close popup and reset state
      closeTagPopup();

      // 7. Add marker to the page (only for new tags, not replies)
      if (tagPopupCoords && !isReplyMode) {
        const newMarker: TagMarker = {
          id: savedTag.id,
          x: tagPopupCoords.x,
          y: tagPopupCoords.y,
          timestamp: Date.now(),
          drawingData: savedTag.drawingData
        };
        setTagMarkers(prev => [...prev, newMarker]);
      }

    } catch (error) {
      console.error('Failed to save tag:', error);
      toast.error('Failed to save tag. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Test function to force open tag popup
  const testTagPopup = () => {
    setTagPopupCoords({ x: 200, y: 200 });
    setIsTagPopupOpen(true);
  };

  // --- Event Listener for Placing Tag (useEffect) ---
  useEffect(() => {
    
    const listener = (event: MouseEvent) => {
      
      // Don't interfere with drawing mode
      if (isDrawingMode) {
        return;
      }

      if (!tagDropModeActive) {
        return;
      }

      if (isDraggingBubble) {
        return;
      }

      const target = event.target as HTMLElement;
      
      // Enhanced check - avoid all UI elements and drawing controls
      if (target.closest('.notifications-panel') || 
          target.closest('.tag-popup-content') ||
          target.closest('#page-drawing-overlay') ||
          target.closest('#page-drawing-canvas') ||
          target.closest('.drawing-controls') ||
          target.closest('button') ||
          target.closest('[role="button"]')) {
        return;
      }

      // Prevent default behavior for this click
      event.preventDefault();
      event.stopPropagation();


      // Calculate popup position with bounds check
      const popupWidth = 320;
      const popupHeight = 380;
      let x = event.clientX;
      let y = event.clientY;
      
      if (x + popupWidth > window.innerWidth) {
        x = window.innerWidth - popupWidth - 10;
      }
      if (y + popupHeight > window.innerHeight) {
        y = window.innerHeight - popupHeight - 10;
      }
      if (x < 10) x = 10;
      if (y < 10) y = 10;

      // Set popup position and open
      setTagPopupCoords({ x, y });
      setIsTagPopupOpen(true);
    };

    // Only add tag drop listeners if not in drawing mode
    if (tagDropModeActive && !isDrawingMode) {
      // Try both capture and bubble phases
      document.addEventListener('click', listener, { capture: true });
      document.addEventListener('click', listener, { capture: false });
    }
    
    return () => {
      document.removeEventListener('click', listener, { capture: true });
      document.removeEventListener('click', listener, { capture: false });
    };
  }, [tagDropModeActive, isDraggingBubble, isDrawingMode]);
  
  // Effect to set mounted state and cleanup drawing events
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Drawing operations cleanup removed
      // Reset cursor if tag drop mode was active
      if (tagDropModeActive) {
        document.body.style.cursor = '';
      }
      // Clean up uploaded file URLs to prevent memory leaks
      uploadedFiles.forEach(file => {
        if (file.previewUrl && file.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, [tagDropModeActive, uploadedFiles]);
  
  const toggleFullScreenDrawingMode = (active: boolean) => {
    // Instead of opening a separate canvas, enable drawing directly on the page
    setIsDrawingMode(active);
    setDrawingState(prev => ({ ...prev, isActive: active, isDrawingOnPage: active }));
    
    // Enable/disable page drawing mode
    if (active) {
      // Override cursor for drawing mode only if not over paint menu
      if (!isMouseOverPaintMenu) {
        document.body.style.cursor = 'crosshair';
      }
      enablePageDrawing();
      // Disable tag drop mode temporarily when drawing
      if (tagDropModeActive) {
        toast.info('Tag Drop Mode temporarily disabled while drawing');
      }
    } else {
      // Restore cursor based on tag drop mode state
      document.body.style.cursor = tagDropModeActive ? 'crosshair' : '';
      disablePageDrawing();
      // Re-enable tag drop mode notification if it was active
      if (tagDropModeActive) {
        toast.info('Tag Drop Mode re-enabled');
      }
    }
  };

  const enablePageDrawing = () => {
    // Add drawing overlay to the page
    const drawingOverlay = document.createElement('div');
    drawingOverlay.id = 'page-drawing-overlay';
    drawingOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9998;
      pointer-events: auto;
      cursor: crosshair;
      background: transparent;
    `;
    
    // Create canvas for drawing
    const canvas = document.createElement('canvas');
    canvas.id = 'page-drawing-canvas';
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: auto;
      cursor: crosshair;
    `;
    
    // Scale canvas for high DPI displays
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
    
    drawingOverlay.appendChild(canvas);
    document.body.appendChild(drawingOverlay);
    
    // Add visual indicator
    const indicator = document.createElement('div');
    indicator.id = 'drawing-mode-indicator';
    indicator.innerHTML = '🎨 Drawing Mode Active - Draw on the page';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(indicator);
    
    // Initialize drawing functionality
    initializePageDrawing(canvas);
  };

  const disablePageDrawing = () => {
    const overlay = document.getElementById('page-drawing-overlay');
    if (overlay) {
      overlay.remove();
    }
    
    const indicator = document.getElementById('drawing-mode-indicator');
    if (indicator) {
      indicator.remove();
    }
  };

  const initializePageDrawing = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let isDrawing = false;
    let startPoint: { x: number; y: number } | null = null;
    let lastPoint: { x: number; y: number } | null = null;
    let currentPath: ImageData | null = null;
    
    const getEventPos = (e: MouseEvent | TouchEvent) => {
      if (e instanceof TouchEvent) {
        const touch = e.touches[0] || e.changedTouches[0];
        return { x: touch.clientX, y: touch.clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };
    
    const setupDrawingStyle = () => {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = drawingState.color;
      ctx.lineWidth = drawingState.lineWidth;
      
      // Set opacity for highlighting
      if (selectedShape === 'highlight') {
        ctx.globalAlpha = 0.4;
        ctx.globalCompositeOperation = 'multiply';
      } else {
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
    };

    const drawShape = (start: { x: number; y: number }, end: { x: number; y: number }) => {
      ctx.beginPath();
      
      switch (selectedShape) {
        case 'circle': {
          const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
          ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
          break;
        }
          
        case 'rectangle':
          ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
          ctx.stroke();
          break;
          
        case 'arrow': {
          const headLength = 20;
          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          
          // Draw line
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          
          // Draw arrow head
          ctx.lineTo(end.x - headLength * Math.cos(angle - Math.PI / 6), end.y - headLength * Math.sin(angle - Math.PI / 6));
          ctx.moveTo(end.x, end.y);
          ctx.lineTo(end.x - headLength * Math.cos(angle + Math.PI / 6), end.y - headLength * Math.sin(angle + Math.PI / 6));
          ctx.stroke();
          break;
        }
          
        case 'highlight':
        case 'pencil':
        default:
          // For pencil and highlight, continue drawing as normal
          break;
      }
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      // Don't start drawing if mouse is over paint menu
      if (isMouseOverPaintMenu) {
        return;
      }
      
      e.preventDefault();
      isDrawing = true;
      const pos = getEventPos(e);
      startPoint = pos;
      lastPoint = pos;
      
      setupDrawingStyle();
      
      if (selectedShape === 'pencil' || selectedShape === 'highlight') {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      } else {
        // For shapes, save the current canvas state
        currentPath = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }
    };
    
    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || !startPoint || isMouseOverPaintMenu) return;
      e.preventDefault();
      
      const pos = getEventPos(e);
      
      if (selectedShape === 'pencil' || selectedShape === 'highlight') {
        // Free drawing
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastPoint = pos;
      } else {
        // Shape drawing - restore canvas and draw preview
        if (currentPath) {
          ctx.putImageData(currentPath, 0, 0);
        }
        setupDrawingStyle();
        drawShape(startPoint, pos);
      }
    };
    
    const stopDrawing = (e?: MouseEvent | TouchEvent) => {
      if (isDrawing) {
        isDrawing = false;
        
        if (startPoint && lastPoint && selectedShape !== 'pencil' && selectedShape !== 'highlight') {
          // Final shape drawing
          const pos = e ? getEventPos(e) : lastPoint;
          if (currentPath) {
            ctx.putImageData(currentPath, 0, 0);
          }
          setupDrawingStyle();
          drawShape(startPoint, pos);
        }
        
        startPoint = null;
        lastPoint = null;
        currentPath = null;
        
        // Save the drawing
        const dataUrl = canvas.toDataURL('image/png');
        setDrawingPreviewUrl(dataUrl);
      }
    };
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing, { passive: false });
    canvas.addEventListener('touchcancel', stopDrawing, { passive: false });
    
    // Prevent scrolling when drawing
    canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
    
    // Event listeners are attached directly to canvas for cleanup
  };

  const handleDrawingStateChange = <K extends keyof DrawingState>(key: K, value: DrawingState[K]) => {
    setDrawingState(prev => ({ ...prev, [key]: value }));
  };

  const handleDrawingComplete = (dataUrl: string) => {
    setDrawingPreviewUrl(dataUrl);
    
    // Convert data URL to file and add to uploaded files
    try {
      if (!dataUrl || !dataUrl.includes(',')) {
        throw new Error('Invalid data URL format');
      }
      const parts = dataUrl.split(',');
      if (parts.length < 2) {
        throw new Error('Malformed data URL');
      }
      const byteString = atob(parts[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], `drawing-${Date.now()}.png`, { type: 'image/png' });
      
      const newUploadedFile: UploadedFile = {
        file,
        previewUrl: dataUrl,
        type: 'drawing'
      };
      
      setUploadedFiles(prev => [...prev, newUploadedFile]);
    } catch (error) {
      console.error('Failed to process drawing data:', error);
      toast.error('Failed to save drawing. Please try again.');
      return;
    }
  };

  const handleSaveDrawing = () => {
    const canvas = document.getElementById('page-drawing-canvas') as HTMLCanvasElement;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      handleDrawingComplete(dataUrl);
    }
    
    // Close drawing mode
    toggleFullScreenDrawingMode(false);
  };

  const handleCancelDrawing = () => {
    toggleFullScreenDrawingMode(false);
  };

  const clearPageDrawing = () => {
    const canvas = document.getElementById('page-drawing-canvas') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disablePageDrawing();
    };
  }, []);
  

  // Data URL to File helper removed - only needed for drawing
  

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


  // Drawing finish handler removed - only full-page drawing is available

  return (
    <>
      {/* Draggable Profile Bubble */}
      <DraggableProfileBubble
        user={user}
        isActive={tagDropModeActive}
        onDragEnd={handleBubbleDragEnd}
        onDragStart={handleBubbleDragStart}
        onDragCancel={handleBubbleDragCancel}
        className="draggable-profile-bubble"
      />
      
      {/* Overlay */}
      {showOverlay && <div className="fixed inset-0 bg-black/20 z-40" onClick={isPinned ? undefined : onClose} aria-hidden="true" />}

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

      {/* --- REDESIGNED TAG DROP POPUP --- */}
      {isTagPopupOpen && tagPopupCoords && (
        <div
          ref={activeTagPopupElement}
          className="tag-popup-content fixed bg-white border border-gray-300 rounded-xl shadow-2xl z-[100] w-[320px] h-[380px] flex flex-col overflow-hidden"
          style={{ 
            left: `${tagPopupCoords.x}px`, 
            top: `${tagPopupCoords.y}px`,
            cursor: isDraggingPopup ? 'move' : 'default',
            pointerEvents: 'auto',
            zIndex: 999999
          }}
        >
          {/* Minimal Drag Handle */}
          <div 
            className="popup-drag-handle flex justify-end items-center p-2 cursor-move flex-shrink-0 border-b border-gray-200"
            onMouseDown={handlePopupDragStart}
            style={{ height: '35px' }}
          >
            <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500 hover:bg-gray-100 rounded-full" onClick={closeTagPopup}>
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* White Content Area with Centered Title */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            {/* Centered Title */}
            <div className="text-center py-2 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">{isReplyMode ? 'Reply to Tag' : 'Create Tag'}</h3>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-3">
                {/* Conversation Context */}
                {isReplyMode && activeConversationId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <div className="text-xs font-semibold text-blue-800 mb-1">💬 Replying to conversation</div>
                    <div className="max-h-10 overflow-y-auto">
                      <div className="text-xs text-blue-700 truncate">
                        {getConversationNotifications && activeConversationId ? 
                          getConversationNotifications(activeConversationId)?.[0]?.comment || 'Previous message' : 
                          'Previous message'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Comment Input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">💭 Your Message</label>
                  <textarea
                    className="w-full p-2 text-sm border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={isReplyMode ? "Reply to conversation..." : "Add your comment..."}
                    rows={2}
                    value={tagComment}
                    onChange={handleCommentChange}
                  />
                </div>

                {/* Staff Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">👥 Notify Staff <span className="text-red-500">*</span></label>
                  <div className="border border-gray-200 rounded-lg p-2">
                    <div className="max-h-16 overflow-y-auto space-y-1">
                      {availableStaff.map(staff => (
                        <div key={staff.id} className="flex items-center justify-between p-1 hover:bg-gray-50 rounded">
                          <span className="text-xs truncate">{staff.name}</span>
                          <input
                            type="checkbox"
                            className="h-3 w-3 text-blue-600 rounded"
                            checked={selectedStaff.some(s => s.id === staff.id)}
                            onChange={() => handleStaffSelect(staff)}
                          />
                        </div>
                      ))}
                    </div>
                    {selectedStaff.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-200">
                        {selectedStaff.map(s => (
                          <span key={s.id} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{s.name.split(' ')[0]}</span>
                        ))}
                      </div>
                    )}
                    {staffSelectionError && (
                      <p className="text-red-500 text-xs flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> Please select at least one staff member
                      </p>
                    )}
                  </div>
                </div>

                {/* Compact Red/Green Approval Switch */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">Request Approval</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={requiresApproval}
                      onChange={(e) => setRequiresApproval(e.target.checked)}
                    />
                    <div className={`w-8 h-4 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 ${
                      requiresApproval ? 'bg-green-500' : 'bg-red-500'
                    } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all`}></div>
                  </label>
                </div>

                {/* Media Features */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700">📎 Attachments</label>
                  
                  {/* File Previews */}
                  {uploadedFiles.length > 0 && (
                    <div className="grid grid-cols-4 gap-1 p-2 bg-gray-50 rounded-lg">
                      {uploadedFiles.map((uploadedFile, index) => (
                        <div key={index} className="relative group">
                          {uploadedFile.type === 'image' && (
                            <img src={uploadedFile.previewUrl} alt="Preview" className="w-full h-8 object-cover rounded border border-gray-200" />
                          )}
                          {uploadedFile.type === 'audio' && (
                            <div className="w-full h-8 flex items-center justify-center bg-blue-100 rounded border border-blue-200">
                              <Mic className="h-3 w-3 text-blue-600"/>
                            </div>
                          )}
                          {uploadedFile.type === 'video' && (
                            <div className="w-full h-8 flex items-center justify-center bg-green-100 rounded border border-green-200">
                              <Video className="h-3 w-3 text-green-600"/>
                            </div>
                          )}
                          {uploadedFile.type === 'drawing' && (
                            <div className="w-full h-8 flex items-center justify-center bg-purple-100 rounded border border-purple-200">
                              <Palette className="h-3 w-3 text-purple-600"/>
                            </div>
                          )}
                          <Button
                            variant="destructive" size="icon"
                            className="absolute -top-1 -right-1 h-4 w-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeUploadedFile(index)}
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Media Action Buttons - ALL FEATURES VISIBLE */}
                  <div className="grid grid-cols-4 gap-1">
                    {/* Screen Record */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "flex flex-col items-center gap-1 h-12 border-2 transition-all hover:scale-105 text-xs",
                        isRecordingScreen ? 'bg-red-50 text-red-700 border-red-300' : 'hover:bg-gray-50'
                      )} 
                      onClick={handleToggleScreenRecord}
                    >
                      <Video className="h-4 w-4" />
                      <span className="text-[10px] font-medium">{isRecordingScreen ? 'Stop' : 'Screen'}</span>
                    </Button>
                    
                    {/* Image Upload */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex flex-col items-center gap-1 h-12 border-2 transition-all hover:scale-105 hover:bg-blue-50 text-xs"
                      onClick={() => document.getElementById('tag-image-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 text-blue-600" />
                      <span className="text-[10px] font-medium">Image</span>
                      <input type="file" id="tag-image-upload" accept="image/*" className="hidden" onChange={handleImageUpload}/>
                    </Button>
                    
                    {/* Audio Record - Hold to Record */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "flex flex-col items-center gap-1 h-12 border-2 transition-all hover:scale-105 select-none text-xs",
                        isRecordingAudio ? 'bg-red-50 text-red-700 border-red-300 shadow-lg' : 'hover:bg-green-50'
                      )} 
                      onMouseDown={handleAudioRecordStart}
                      onMouseUp={handleAudioRecordStop}
                      onMouseLeave={handleAudioRecordStop}
                      onTouchStart={handleAudioRecordStart}
                      onTouchEnd={handleAudioRecordStop}
                      onTouchCancel={handleAudioRecordStop}
                    >
                      <Mic className={cn("h-4 w-4 transition-all", isRecordingAudio && "animate-pulse")} />
                      <span className="text-[10px] font-medium">{isRecordingAudio ? 'Recording...' : 'Hold Audio'}</span>
                    </Button>
                    
                    {/* Paint Feature */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex flex-col items-center gap-1 h-12 border-2 transition-all hover:scale-105 hover:bg-purple-50 text-xs"
                      onClick={() => {
                        toggleFullScreenDrawingMode(true);
                        closeTagPopup();
                      }}
                    >
                      <Palette className="h-4 w-4 text-purple-600" />
                      <span className="text-[10px] font-medium">Paint</span>
                    </Button>
                  </div>
                </div>

                {/* Bottom padding for scroll */}
                <div className="h-2"></div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div 
            className="bg-white p-2 flex gap-2 border-t border-gray-200 flex-shrink-0"
            style={{ height: '45px' }}
          >
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-gray-600 flex-1">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{uploadProgress}%</span>
              </div>
            )}
            <Button 
              variant="outline" 
              className="flex-1 h-8 text-gray-700 border border-gray-300 hover:bg-gray-50 font-medium text-sm"
              onClick={closeTagPopup}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 h-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all text-sm"
              onClick={handleSaveTag}
              disabled={isUploading || selectedStaff.length === 0}
            >
              <Save className="h-3 w-3 mr-1" /> 
              {isUploading ? 'Saving...' : (isReplyMode ? 'Reply' : 'Send Tag')}
            </Button>
          </div>
        </div>
      )}

      {/* Compact Elegant Paint Menu */}
      {isDrawingMode && (
        <>
          {/* Invisible drawing blocker overlay for paint menu area */}
          <div 
            className="fixed top-0 left-1/2 transform -translate-x-1/2 z-[9998]"
            style={{ 
              zIndex: 9998,
              width: '340px',
              height: '200px',
              pointerEvents: 'auto',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={() => setIsMouseOverPaintMenu(true)}
            onMouseLeave={() => setIsMouseOverPaintMenu(false)}
            onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onMouseMove={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onMouseUp={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onTouchStart={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onTouchMove={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onPointerMove={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onPointerUp={(e) => { e.stopPropagation(); e.preventDefault(); }}
          />
          
          <div 
            className="drawing-controls fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-200 p-3 pointer-events-auto"
            style={{ 
              zIndex: 10000, 
              cursor: 'default', 
              minWidth: '240px', 
              maxWidth: '320px',
              pointerEvents: 'auto' 
            }}
            onMouseEnter={() => {
              setIsMouseOverPaintMenu(true);
              // Completely disable drawing cursor and canvas interactions
              document.body.style.cursor = 'default';
              const canvas = document.getElementById('page-drawing-canvas') as HTMLCanvasElement;
              const overlay = document.getElementById('page-drawing-overlay') as HTMLElement;
              if (canvas && canvas.style) {
                canvas.style.pointerEvents = 'none';
                canvas.style.display = 'none';
                canvas.style.visibility = 'hidden';
                canvas.style.zIndex = '-1';
              }
              if (overlay && overlay.style) {
                overlay.style.pointerEvents = 'none';
                overlay.style.display = 'none';
                overlay.style.visibility = 'hidden';
                overlay.style.zIndex = '-1';
              }
            }}
            onMouseLeave={() => {
              setIsMouseOverPaintMenu(false);
              // Re-enable drawing cursor and canvas interactions
              if (isDrawingMode && !isMouseOverPaintMenu) {
                document.body.style.cursor = 'crosshair';
                const canvas = document.getElementById('page-drawing-canvas') as HTMLCanvasElement;
                const overlay = document.getElementById('page-drawing-overlay') as HTMLElement;
                if (canvas) {
                  canvas.style.pointerEvents = 'auto';
                  canvas.style.display = 'block';
                  canvas.style.visibility = 'visible';
                  canvas.style.zIndex = '9998';
                }
                if (overlay) {
                  overlay.style.pointerEvents = 'auto';
                  overlay.style.display = 'block';
                  overlay.style.visibility = 'visible';
                  overlay.style.zIndex = '9998';
                }
              }
            }}
            onMouseMove={(e) => {
              // Force cursor to stay normal and prevent any drawing
              e.currentTarget.style.cursor = 'default';
              document.body.style.cursor = 'default';
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              // Completely prevent any click events from propagating
              e.stopPropagation();
              e.preventDefault();
            }}
            onMouseDown={(e) => {
              // Prevent mousedown events that could trigger drawing
              e.stopPropagation();
              e.preventDefault();
            }}
            onMouseUp={(e) => {
              // Prevent mouseup events
              e.stopPropagation();
              e.preventDefault();
            }}
            onTouchStart={(e) => {
              // Prevent touch events on mobile
              e.stopPropagation();
              e.preventDefault();
            }}
            onTouchMove={(e) => {
              // Prevent touch move events on mobile
              e.stopPropagation();
              e.preventDefault();
            }}
            onTouchEnd={(e) => {
              // Prevent touch end events on mobile
              e.stopPropagation();
              e.preventDefault();
            }}
            onPointerDown={(e) => {
              // Prevent pointer events
              e.stopPropagation();
              e.preventDefault();
            }}
            onPointerMove={(e) => {
              // Prevent pointer move events
              e.stopPropagation();
              e.preventDefault();
            }}
            onPointerUp={(e) => {
              // Prevent pointer up events
              e.stopPropagation();
              e.preventDefault();
            }}
            onDragStart={(e) => {
              // Prevent drag events
              e.stopPropagation();
              e.preventDefault();
            }}
            onDrag={(e) => {
              // Prevent drag events
              e.stopPropagation();
              e.preventDefault();
            }}
            onDragEnd={(e) => {
              // Prevent drag end events
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-semibold text-gray-800">Paint Tools</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFullScreenDrawingMode(false)}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            {/* Tools Row */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Tools:</span>
              <div className="flex items-center gap-1">
                {[
                  { tool: 'highlight', icon: Highlighter, label: 'Highlight' },
                  { tool: 'pencil', icon: Edit3, label: 'Draw' },
                  { tool: 'circle', icon: Circle, label: 'Circle' },
                  { tool: 'rectangle', icon: Square, label: 'Rectangle' },
                  { tool: 'arrow', icon: ArrowUp, label: 'Arrow' }
                ].map(({ tool, icon: Icon, label }) => (
                  <button
                    key={tool}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setSelectedShape(tool as 'pencil' | 'circle' | 'rectangle' | 'arrow' | 'highlight');
                      // Also update the drawing state tool
                      handleDrawingStateChange('tool', tool);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    className={`p-1.5 rounded-lg border transition-all hover:scale-105 ${
                      selectedShape === tool 
                        ? 'bg-purple-100 border-purple-500 text-purple-700' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                    title={label}
                  >
                    <Icon className="h-3 w-3" />
                  </button>
                ))}
              </div>
            </div>

            {/* Colors Row - Single Horizontal Row */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Colors:</span>
              <div className="flex items-center gap-1">
                {/* Essential Color Palette - 12 circles in one horizontal row */}
                {[
                  // Primary colors
                  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
                  // Secondary colors  
                  '#FFFFFF', '#808080', '#FFA500', '#800080', '#00FFFF', '#FFC0CB'
                ].map((color, index) => (
                  <div
                    key={color}
                    className="w-3 h-3 rounded-full border border-gray-500 transition-all hover:scale-150 hover:z-10 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDrawingStateChange('color', color);
                      handleDrawingStateChange('lineWidth', 4);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    style={{ 
                      backgroundColor: color,
                      minWidth: '12px',
                      minHeight: '12px',
                      transform: drawingState.color === color ? 'scale(1.3)' : 'scale(1)',
                      boxShadow: drawingState.color === color ? '0 0 0 1px #3b82f6' : 'none'
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Size Row */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-600">Size:</span>
              <div className="flex items-center gap-1">
                {[4, 8, 12, 16].map(width => (
                  <button
                    key={width}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleDrawingStateChange('lineWidth', width);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all hover:scale-105 ${
                      drawingState.lineWidth === width ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    title={`${width}px`}
                  >
                    <div 
                      className="bg-current rounded-full" 
                      style={{ width: `${Math.min(width/3, 4)}px`, height: `${Math.min(width/3, 4)}px` }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const canvas = document.getElementById('page-drawing-canvas') as HTMLCanvasElement;
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                  }
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="h-7 px-2 text-xs flex-1"
              >
                Clear
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const canvas = document.getElementById('page-drawing-canvas') as HTMLCanvasElement;
                  if (canvas) {
                    const dataUrl = canvas.toDataURL('image/png');
                    handleDrawingComplete(dataUrl);
                    toggleFullScreenDrawingMode(false);
                    toast.success('Drawing saved! 🎨');
                  } else {
                    console.error('Canvas not found');
                    toast.error('Error: Drawing canvas not found');
                  }
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="h-7 px-2 text-xs bg-purple-600 hover:bg-purple-700 flex-1"
              >
                Save
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Notifications Panel */}
      <div
        ref={panelRef}
        className={cn(
          "notifications-panel fixed right-0 top-0 h-screen bg-white z-50 shadow-lg transition-all duration-300 ease-in-out",
          effectiveIsOpen ? "" : "hidden",
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
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" onClick={togglePin} title={isPinned ? "Unpin panel" : "Pin panel"}>
                  <Pin className={cn("h-4 w-4 text-gray-500", isPinned && "fill-current text-blue-600")} />
                </Button>
                <Button variant="ghost" size="icon" onClick={togglePanelSize} title="Resize panel">
                  {panelSize === 'quarter' ? <Maximize2 className="h-4 w-4 text-gray-500" /> : <Minimize2 className="h-4 w-4 text-gray-500" />} 
                </Button>
                <Button variant="ghost" size="icon" onClick={minimizePanel} title="Minimize panel"><ArrowLeftRight className="h-4 w-4 text-gray-500" /></Button>
                <Button variant="ghost" size="icon" onClick={onClose} title="Close panel">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">DS</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Start Tag Drop Button */}
            <div className="p-4 space-y-2">
              <Button
                size="lg"
                className={cn(
                  "w-full h-12 text-base font-medium flex items-center justify-center gap-2",
                  tagDropModeActive
                    ? "bg-red-500 hover:bg-red-600 text-white" 
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                )}
                onClick={toggleTagDropMode}
              >
                <Tag className="h-5 w-5" />
                {tagDropModeActive ? "Cancel Tag Drop" : "Start Tag Drop"}
              </Button>
              
              {/* Test Button */}
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={testTagPopup}
              >
                Test Tag Popup
              </Button>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 pb-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { key: 'all', label: 'All Tags', icon: Hash },
                  { key: 'team', label: 'Teams', icon: Users },
                  { key: 'calendar', label: 'Calendar', icon: Calendar },
                  { key: 'comments', label: 'Comments', icon: MessageSquare },
                  { key: 'account', label: 'Mentions', icon: Bell },
                  { key: 'security', label: 'Activity', icon: Activity, badge: notificationCounts.security }
                ].map(({ key, label, icon: Icon, badge }) => (
                  <div key={key} className={cn(
                    "relative flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-colors",
                    activeTab === key ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50 text-gray-600"
                  )} onClick={() => setActiveTab(key as ActiveTab)}>
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">{label}</span>
                    {badge && badge > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 leading-none">
                        {badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-4 pb-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in Activity..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notification List Area */}
            <div className="flex-1 overflow-y-auto">
              {(() => {
                type NotificationType = Notification['type']; 

                const getVisibleTypesForTab = (tab: ActiveTab): Array<NotificationType> => {
                  switch (tab) {
                    case 'team':
                      return ['team'];
                    case 'trades':
                      return ['job', 'quote', 'payment']; 
                    case 'calendar':
                      return ['calendar'];
                    case 'comments':
                      return ['message', 'comment', 'tag']; 
                    case 'account':
                      return ['account'];
                    case 'security':
                      return ['security'];
                    default:
                      return []; 
                  }
                };

                const filteredNotifications = (notifications || []).filter(n => {
                  if (activeTab === 'all') return true;
                  const visibleTypes = getVisibleTypesForTab(activeTab);
                  return visibleTypes.includes(n.type);
                });

                if (filteredNotifications.length === 0) {
                  const emptyMessages = {
                    all: "No notifications",
                    team: "No team notifications",
                    trades: "No trade notifications",
                    calendar: "No calendar notifications",
                    comments: "No comments or tags",
                    account: "No account notifications",
                    security: "No security notifications"
                  };
                  
                  return (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500">
                      <Bell className="h-12 w-12 mb-4 text-gray-300" />
                      <p className="text-sm">{emptyMessages[activeTab]}</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-1 p-4">
                    {filteredNotifications.map(notification =>
                      <div key={notification.id} className="hover:bg-gray-50 rounded-lg transition-colors">
                        <NotificationItem
                          {...notification}
                          isPanelPinned={isPinned}
                          onReply={handleReplyToNotification}
                        />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50">
              <Link to="/notifications" className="text-blue-600 text-sm text-center block w-full hover:underline font-medium" onClick={isPinned ? undefined : onClose}>
                View all notifications
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};