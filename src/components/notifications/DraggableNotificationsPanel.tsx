import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Bell, PinIcon, Maximize2, Minimize2, ArrowLeftRight, Pin, Calendar, MessageSquare, Tag, Edit3, Image, UploadCloud, MessageCircle, Save, Mic, Trash2, Brush, Paperclip, UserPlus, AlertCircle, Minus, MoveUpRight, Square, Circle, Star, Reply } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';
import { useNotifications, type Notification } from './NotificationContextProvider';

type PanelSize = 'quarter' | 'half' | 'custom' | 'minimized';
type ActiveTab = 'all' | 'team' | 'trades' | 'account' | 'security' | 'calendar' | 'comments';

interface TagMarker {
  id: string;
  x: number;
  y: number;
  timestamp: number; // To manage temporary display
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
  const [isTagPopupOpen, setIsTagPopupOpen] = useState(false); // Tracks if the single popup is open
  const [tagPopupCoords, setTagPopupCoords] = useState<{ x: number; y: number } | null>(null);
  const [tagMarkers, setTagMarkers] = useState<TagMarker[]>([]); // Stores saved tag markers (temporary logos)
  const activeTagPopupElement = useRef<HTMLDivElement | null>(null); // Ref to the DOM element of the popup

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
  const notificationCounts = { all: 98, team: 5, trades: 9, calendar: 3, comments: 6, account: 0, security: 0 }; // Mock counts


  // --- Tag Drop Core Logic ---

  // Toggles the overall Tag Drop mode on/off
  const toggleTagDropMode = () => {
    console.log('[TagDrop] toggleTagDropMode called.'); // Add log here
    setTagDropModeActive(prev => {
      const nextState = !prev;
      console.log('[TagDrop] Setting tagDropModeActive to:', nextState); // Add log here
      if (!nextState) { // Turning OFF
        closeTagPopup(); // Close any open popup
        document.body.style.cursor = '';
      } else { // Turning ON
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
  };

  // Closes the tag pop-up window and resets state
  const closeTagPopup = useCallback(() => {
    if (isTagPopupOpen) {
        if (activeTagPopupElement.current) {
             // Potentially remove the element if dynamically created, or just hide if rendered conditionally
        }
        setIsTagPopupOpen(false);
        resetTagPopupState();
        // Restore cursor based on whether tag drop mode is still globally active
        document.body.style.cursor = tagDropModeActive ? 'crosshair' : '';
    }
  }, [isTagPopupOpen, tagDropModeActive]); // Include tagDropModeActive

  // Handle click on page to place a new tag (for CREATION)
  const handlePlaceNewTag = useCallback((event: MouseEvent) => {
    // 1. Check basic conditions: Mode must be active, no creation/viewing popup open
    if (!tagDropModeActive || isTagPopupOpen) return; 

    const target = event.target as HTMLElement;

    // 2. Ignore clicks on the notification panel itself or its buttons/interactive elements
    if (panelRef.current?.contains(target)) {
        // console.log("Click inside panel, ignoring for tag placement.");
        return; 
    }
    
    // 3. Ignore clicks on existing markers or popups
    if (target.closest('.tag-marker, .tag-popup-content, .tag-view-popup-content')) {
       // console.log("Click on marker/popup, ignoring for tag placement.");
        return;
    }
    
    // 4. Ignore clicks on common interactive elements that shouldn't trigger a tag
    if (target.closest('button, a, input, textarea, select')) {
        // console.log("Click on interactive element, ignoring for tag placement.");
        return;
    }

    // 5. If none of the above, proceed to place the tag
    console.log("Placing new tag creation popup at", event.clientX, event.clientY);
    
    // --- Stop propagation *only* if we are actually placing a tag --- 
    event.stopPropagation(); 
    event.preventDefault(); 

    setTagPopupCoords({ x: event.clientX, y: event.clientY });
    setIsTagPopupOpen(true); // This check happens *inside* the function, no need for it in deps
    document.body.style.cursor = 'default';

  }, [tagDropModeActive]); // REMOVED isTagPopupOpen from dependency array


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
      console.log("[Placeholder] Toggle drawing canvas");
      setIsDrawingActive(!isDrawingActive);
      // In reality, this would show/hide or interact with a drawing component
      if (!isDrawingActive && !uploadedFiles.some(f => f.type === 'drawing')) {
         // Simulate adding a drawing placeholder if toggled on
         const drawingPlaceholder: UploadedFile = {
             file: new File([], "drawing.png"), // Dummy file
             previewUrl: "https://via.placeholder.com/64/cccccc/888888?text=Drawing",
             type: 'drawing'
         };
         setUploadedFiles(prev => [...prev, drawingPlaceholder]);
      } else if (isDrawingActive) {
         // Simulate removing placeholder if toggled off (real version would save data)
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

    const tagId = `tag_${currentUserId}_${Date.now()}`;
    const originalCoords = tagPopupCoords; // Capture coords before closing

    // 1. Close the popup first
    closeTagPopup();

    // 2. Upload files (placeholder)
    const uploadPromises = uploadedFiles.map(async (uploadedFile) => {
        const folderPath = `tag_drops/${tagId}`;
        let fileName = uploadedFile.file.name;
        if (uploadedFile.type === 'drawing') fileName = 'drawing.png';
        if (uploadedFile.type === 'audio') fileName = 'recording.mp3';
        
        try {
             // In a real scenario, pass the actual file/blob or drawing data
             const url = await uploadFileToSupabase(uploadedFile.file, folderPath, fileName);
             return { ...uploadedFile, supabaseUrl: url };
        } catch (error) {
            console.error("Upload failed:", error);
            return { ...uploadedFile, supabaseUrl: undefined }; // Mark as failed
        }
    });
    
    const uploadedFilesWithUrls = await Promise.all(uploadPromises);

    // 3. Prepare tag data for backend/notification
    const tagDataPayload = {
      id: tagId,
      creatorId: currentUserId,
      comment: tagComment,
      taggedStaffIds: selectedStaff.map(s => s.id),
      attachments: uploadedFilesWithUrls
          .filter(f => f.supabaseUrl) // Only include successfully uploaded files
          .map(f => ({ type: f.type, url: f.supabaseUrl })),
      coords: originalCoords,
      timestamp: Date.now(),
    };

    console.log("[Save Tag] Data Payload:", tagDataPayload);
    
    // 4. Simulate sending notification to backend/service
    console.log(`[Simulate] Sending notification for tag ${tagId} to staff: ${selectedStaff.map(s => s.name).join(', ')}`);
    // --> dispatchNotification(tagDataPayload);

    // 5. Show temporary logo marker at original coordinates
    if (originalCoords) {
        const newMarker: TagMarker = {
            id: tagId,
            x: originalCoords.x,
            y: originalCoords.y,
            timestamp: Date.now()
        };
        setTagMarkers(prev => [...prev, newMarker]);
    }
    
    // 6. Reset popup state (already done in closeTagPopup)
  };

  // --- Event Listener for Placing Tag (useEffect) ---
  useEffect(() => {
    console.log('[TagDropEffect] Running effect. Mode active:', tagDropModeActive); // Log effect run

    const listener = (event: MouseEvent) => handlePlaceNewTag(event);

    if (tagDropModeActive) {
        console.log('[TagDropEffect] Adding click listener.'); // Log listener add
        document.addEventListener('click', listener, true); 
    } else {
        console.log('[TagDropEffect] Removing click listener.'); // Log listener remove
        document.removeEventListener('click', listener, true);
    }
    
    // Cleanup function
    return () => {
      console.log('[TagDropEffect] Cleanup: Removing click listener.'); // Log cleanup
      document.removeEventListener('click', listener, true);
      // Ensure cursor is reset if component unmounts while mode is active
      if (tagDropModeActive) {
          console.log('[TagDropEffect] Cleanup: Resetting cursor.'); // Log cursor reset
          document.body.style.cursor = '';
      }
    };
  }, [tagDropModeActive, handlePlaceNewTag]); 


  return (
    <>
      {/* Overlay */}
      {showOverlay && ( <div className="fixed inset-0 bg-black/20 z-40" onClick={isPinned ? undefined : onClose} aria-hidden="true" /> )}

      {/* Temporary Tag Markers (Logos) */}
      {tagMarkers.map(marker => (
        <div
          key={marker.id}
          className="tag-marker fixed z-[99] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-opacity duration-300 pointer-events-none" // No pointer events for marker
          style={{ left: `${marker.x}px`, top: `${marker.y}px`, opacity: 1 }} // Opacity handled by cleanup effect
          title="Tag placed"
        >
          <img src={businessLogoUrl} alt="Tag marker" className="w-8 h-8 drop-shadow-lg" />
        </div>
      ))}

      {/* --- Tag Drop Popup (Conditionally Rendered) --- */}
      {isTagPopupOpen && tagPopupCoords && (
          <div
              ref={activeTagPopupElement} // Assign ref if needed for direct DOM manipulation (like drag)
              className="tag-popup-content fixed bg-white border border-gray-300 rounded-lg shadow-xl z-[100] w-[380px] flex flex-col"
              style={{ left: `${tagPopupCoords.x + 5}px`, top: `${tagPopupCoords.y + 5}px` }}
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside propagating to the placement listener
          >
              {/* Header */}
              <div className="flex justify-between items-center p-3 border-b bg-gray-50 rounded-t-lg">
                  <div className="flex items-center gap-2">
                      <img src={businessLogoUrl} alt="Logo" className="h-5 w-5 rounded-full" />
                      <span className="font-semibold text-gray-700">Create Tag</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={closeTagPopup}>
                      <X className="h-4 w-4" />
                  </Button>
              </div>

              {/* Content Area */}
              <div className="p-4 flex flex-col gap-4">
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
                                      {uploadedFile.type === 'drawing' && (
                                         // Use a specific icon for the drawing preview placeholder
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
                           <Button variant="outline" size="sm" className="flex-1 text-xs gap-1" onClick={() => document.getElementById('tag-image-upload')?.click()}>
                               <Image className="h-3.5 w-3.5"/> Image
                               <input type="file" id="tag-image-upload" accept="image/*" className="hidden" onChange={handleImageUpload}/>
                           </Button>
                           <Button 
                               variant="outline" 
                               size="sm" 
                               className={cn(
                                   "flex-1 text-xs gap-1", 
                                   isDrawingActive ? 'bg-blue-100 text-blue-700 border-blue-300' : '' // Active state style
                               )} 
                               onClick={handleToggleDrawing}
                            >
                               <Brush className="h-3.5 w-3.5"/> Draw
                           </Button>
                           <Button 
                               variant="outline" 
                               size="sm" 
                               className={cn(
                                   "flex-1 text-xs gap-1", 
                                   isRecordingAudio ? 'bg-red-100 text-red-700 border-red-300' : '' // Active state style
                               )} 
                               onClick={handleToggleAudioRecord}
                            >
                               <Mic className="h-3.5 w-3.5"/> Voice
                           </Button>
                      </div>
                      
                      {/* --- Conditionally Rendered Drawing Toolbar --- */}
                      {isDrawingActive && (
                          <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col gap-3">
                              {/* Row 1: Tools & Brush Options */}
                              <div className="flex items-center gap-4">
                                  {/* Tools Section */}
                                  <div className="flex items-center gap-1 border-r pr-3">
                                      <span className="text-xs font-medium mr-1">Tools:</span>
                                      {/* Placeholder Icons for Tools */}
                                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Pencil"><Edit3 className="h-4 w-4" /></Button>
                                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Text">A</Button> {/* Simple Text Icon */}
                                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Eraser"><Trash2 className="h-4 w-4" /></Button> 
                                      {/* Add more tool icons as needed */}
                                  </div>
                                  {/* Brush Section */}
                                  <div className="flex items-center gap-1">
                                       <span className="text-xs font-medium mr-1">Brush:</span>
                                       {/* Placeholder for brush dropdown */}
                                       <select className="text-xs border rounded px-1 py-0.5">
                                          <option>Normal</option>
                                          <option>Thick</option>
                                          <option>Spray</option>
                                       </select>
                                  </div>
                              </div>
                              
                              {/* Row 2: Shapes & Colors */}
                              <div className="flex items-center gap-4">
                                  {/* Shapes Section */}
                                  <div className="flex items-center gap-1 border-r pr-3 flex-wrap">
                                      <span className="text-xs font-medium mr-1 w-full mb-1">Shapes:</span>
                                      {/* Placeholder Icons for Shapes */}
                                      <Button variant="ghost" size="icon" className="h-6 w-6"><Minus className="h-4 w-4"/></Button> {/* Line */}
                                      <Button variant="ghost" size="icon" className="h-6 w-6"><MoveUpRight className="h-4 w-4"/></Button> {/* Arrow */}
                                      <Button variant="ghost" size="icon" className="h-6 w-6"><Square className="h-4 w-4"/></Button>
                                      <Button variant="ghost" size="icon" className="h-6 w-6"><Circle className="h-4 w-4"/></Button>
                                      <Button variant="ghost" size="icon" className="h-6 w-6"><Star className="h-4 w-4"/></Button>
                                       {/* Add more shape icons... */}
                                  </div>
                                  {/* Colours Section */}
                                  <div className="flex items-center gap-1 flex-wrap">
                                      <span className="text-xs font-medium mr-1 w-full mb-1">Colours:</span>
                                      {/* Placeholder Color Swatches */}
                                      {['#FF0000', '#000000', '#FFFFFF', '#CCCCCC', '#888888', '#FFFF00', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF'].map(color => (
                                          <Button key={color} variant="outline" size="icon" className="h-5 w-5 p-0 border rounded-full" style={{ backgroundColor: color }} title={color}></Button>
                                      ))}
                                       {/* Add more colors... */}
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 p-3 border-t bg-gray-50 rounded-b-lg">
                  <Button variant="ghost" onClick={closeTagPopup}>Cancel</Button>
                  <Button onClick={handleSaveTag}>
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
          // Remove transform classes: isOpen ? "translate-x-0" : "translate-x-full",
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
                {/* Removed Edit3 button for general drawing from header, can be added back if needed */}
                <Button variant="ghost" size="icon" onClick={onClose} title="Close panel"><X className="h-5 w-5" /></Button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="border-b">
              <div className="flex overflow-x-auto px-4 py-2 gap-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {/* Tab buttons like before */}
                {(Object.keys(notificationCounts) as ActiveTab[]).map(tab => (
                    <div key={tab} className={cn(
                        "relative flex items-center justify-center px-3 py-1.5 rounded-md cursor-pointer whitespace-nowrap text-sm",
                        activeTab === tab ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
                      )} onClick={() => setActiveTab(tab)}>
                          {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1').trim()} {/* Format tab name */}
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
                      ? "bg-red-100 text-red-700 hover:bg-red-200" // Style for cancelling
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200" // Style for starting
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
              {/* Render notifications based on activeTab */}
              {(() => {
                 // Now we can directly use the imported Notification type
                 type NotificationType = Notification['type']; 

                const getVisibleTypesForTab = (tab: ActiveTab): Array<NotificationType> => {
                    switch (tab) {
                        case 'trades':
                            return ['job', 'quote', 'payment']; 
                        case 'comments':
                            return ['message', 'other']; // Assuming 'other' might include tags or specific comment types
                        // case 'calendar':
                        //     return ['calendar']; // Removed: 'calendar' is not a valid NotificationType
                        // Map 'team', 'account', 'security' if they correspond to specific notification types
                        default:
                            return []; 
                    }
                };

                const filteredNotifications = notifications.filter(n => {
                    if (activeTab === 'all') return true;
                    const visibleTypes = getVisibleTypesForTab(activeTab);
                    // Now comparing Notification['type'] with an array of Notification['type']
                    return visibleTypes.includes(n.type);
                });

                // --- Empty State Rendering ---
                // (Keep the logic for rendering empty states as modified before)
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

                // Render the filtered notifications
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