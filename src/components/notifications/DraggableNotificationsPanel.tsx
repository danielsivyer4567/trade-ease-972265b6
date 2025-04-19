import React, { useState, useRef, useEffect } from 'react';
import { X, Bell, PinIcon, Maximize2, Minimize2, ArrowLeftRight, Pin, Calendar, MessageSquare, Tag, Edit3, Image, UploadCloud, MessageCircle, Save } from 'lucide-react';
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
  const [tagDragEnabled, setTagDragEnabled] = useState(false);
  const [showTagDragInstructions, setShowTagDragInstructions] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const leftResizeHandleRef = useRef<HTMLDivElement>(null);
  const tagDragRef = useRef<HTMLDivElement>(null);
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

  // Enable drag feature for tag drops
  const enableTagDrag = () => {
    setTagDragEnabled(true);
    setShowTagDragInstructions(true);
    document.body.style.cursor = 'grab';
  };

  // Disable drag feature and reset
  const disableTagDrag = () => {
    setTagDragEnabled(false);
    setShowTagDragInstructions(false);
    document.body.style.cursor = '';
    setSelectedTag(null);
  };

  // Handle the placement of a tag
  const handleTagPlacement = (event: React.MouseEvent) => {
    if (!tagDragEnabled) return;
    
    // Create tag element at the clicked position
    const tagElement = document.createElement('div');
    tagElement.className = 'fixed bg-blue-50 border border-blue-300 rounded-lg p-3 shadow-lg z-50 w-[350px]';
    tagElement.style.left = `${event.clientX}px`;
    tagElement.style.top = `${event.clientY}px`;
    
    // Create tag content
    const tagContent = document.createElement('div');
    tagContent.className = 'flex flex-col gap-3';
    
    // Tag header
    const tagHeader = document.createElement('div');
    tagHeader.className = 'flex justify-between items-center';
    tagHeader.innerHTML = `
      <span class="font-medium text-base">Tag drop</span>
      <span class="bg-blue-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm font-bold">?</span>
    `;
    
    // Comment input
    const commentContainer = document.createElement('div');
    commentContainer.className = 'border border-gray-300 rounded-lg overflow-hidden';
    
    const commentInput = document.createElement('textarea');
    commentInput.className = 'w-full p-3 text-gray-700 resize-none focus:outline-none';
    commentInput.placeholder = 'Add a comment...';
    commentInput.rows = 2;
    
    // Staff selection area
    const staffSelectionArea = document.createElement('div');
    staffSelectionArea.className = 'px-3 py-2 border-t border-gray-300 bg-gray-50 flex justify-between items-center';
    staffSelectionArea.innerHTML = `
      <div class="text-sm text-gray-500">Choose staff to notify</div>
      <div class="flex items-center gap-2">
        <button class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">+</button>
        <button class="w-6 h-6 rounded-full bg-gray-700 text-white flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-5a1 1 0 0 0-1 1v3H6a1 1 0 1 0 0 2h3v3a1 1 0 1 0 2 0v-3h3a1 1 0 1 0 0-2h-3V6a1 1 0 0 0-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    `;

    // Action buttons
    const actionButtons = document.createElement('div');
    actionButtons.className = 'flex justify-between gap-2 mt-2';
    
    // Save button
    const saveButton = document.createElement('button');
    saveButton.className = 'flex-1 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium';
    saveButton.textContent = 'Save';
    
    // Reply button
    const replyButton = document.createElement('button');
    replyButton.className = 'flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium';
    replyButton.textContent = 'reply';
    
    // Cancel button
    const cancelButton = document.createElement('button');
    cancelButton.className = 'flex-1 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium';
    cancelButton.textContent = 'Cancel';
    
    // Add all buttons to the action buttons container
    actionButtons.appendChild(saveButton);
    actionButtons.appendChild(replyButton);
    actionButtons.appendChild(cancelButton);
    
    // Assemble the comment container
    commentContainer.appendChild(commentInput);
    commentContainer.appendChild(staffSelectionArea);
    
    // Assemble the tag
    tagContent.appendChild(tagHeader);
    tagContent.appendChild(commentContainer);
    tagContent.appendChild(actionButtons);
    tagElement.appendChild(tagContent);
    
    // Add to document
    document.body.appendChild(tagElement);
    
    // Make the tag draggable
    makeDraggable(tagElement, tagHeader);
    
    // Enable file upload via drag and drop
    enableImageUpload(commentContainer);
    
    // Setup reply functionality
    replyButton.addEventListener('click', () => {
      const replyContainer = document.createElement('div');
      replyContainer.className = 'border border-gray-300 rounded-lg overflow-hidden mt-3';
      
      const replyInput = document.createElement('textarea');
      replyInput.className = 'w-full p-3 text-gray-700 resize-none focus:outline-none';
      replyInput.placeholder = 'Type your reply...';
      replyInput.rows = 2;
      
      replyContainer.appendChild(replyInput);
      tagContent.appendChild(replyContainer);
      
      // Add reply actions
      const replyActions = document.createElement('div');
      replyActions.className = 'flex justify-end gap-2 mt-2';
      
      const sendReplyButton = document.createElement('button');
      sendReplyButton.className = 'px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium';
      sendReplyButton.textContent = 'Send';
      
      const cancelReplyButton = document.createElement('button');
      cancelReplyButton.className = 'px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium';
      cancelReplyButton.textContent = 'Cancel';
      
      replyActions.appendChild(cancelReplyButton);
      replyActions.appendChild(sendReplyButton);
      
      tagContent.appendChild(replyActions);
      
      // Focus the reply input
      replyInput.focus();
      
      // Handle reply cancel
      cancelReplyButton.addEventListener('click', () => {
        tagContent.removeChild(replyContainer);
        tagContent.removeChild(replyActions);
      });
      
      // Handle reply send
      sendReplyButton.addEventListener('click', () => {
        const replyText = replyInput.value.trim();
        if (replyText) {
          const replyDisplay = document.createElement('div');
          replyDisplay.className = 'mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200';
          
          const replyHeader = document.createElement('div');
          replyHeader.className = 'flex items-center gap-2 mb-1';
          replyHeader.innerHTML = `
            <div class="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">U</div>
            <div class="text-sm font-medium">You</div>
            <div class="text-xs text-gray-500">just now</div>
          `;
          
          const replyContent = document.createElement('p');
          replyContent.className = 'text-sm text-gray-700';
          replyContent.textContent = replyText;
          
          replyDisplay.appendChild(replyHeader);
          replyDisplay.appendChild(replyContent);
          
          // Replace the reply input with the reply display
          tagContent.removeChild(replyContainer);
          tagContent.removeChild(replyActions);
          tagContent.appendChild(replyDisplay);
        }
      });
    });
    
    // Save button functionality
    saveButton.addEventListener('click', () => {
      // Save logic - replace textarea with the comment text
      const comment = commentInput.value.trim();
      if (comment) {
        const commentElement = document.createElement('p');
        commentElement.className = 'text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded border border-gray-200';
        commentElement.textContent = comment;
        
        // Add the dashed highlight to the target
        const targetElement = document.elementFromPoint(event.clientX, event.clientY);
        if (targetElement && targetElement !== tagElement) {
          const rect = targetElement.getBoundingClientRect();
          const highlightElement = document.createElement('div');
          highlightElement.className = 'absolute border-2 border-red-500 border-dashed pointer-events-none';
          highlightElement.style.left = `${rect.left}px`;
          highlightElement.style.top = `${rect.top}px`;
          highlightElement.style.width = `${rect.width}px`;
          highlightElement.style.height = `${rect.height}px`;
          document.body.appendChild(highlightElement);
        }
        
        // Persist the tag element but update its appearance
        commentContainer.remove();
        tagContent.insertBefore(commentElement, actionButtons);
        
        // Update action buttons
        actionButtons.innerHTML = '';
        const viewButton = document.createElement('button');
        viewButton.className = 'flex-1 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium';
        viewButton.textContent = 'View';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium';
        closeButton.textContent = 'Close';
        
        actionButtons.appendChild(viewButton);
        actionButtons.appendChild(closeButton);
        
        closeButton.addEventListener('click', () => {
          tagElement.remove();
        });
      }
    });
    
    // Cancel button functionality
    cancelButton.addEventListener('click', () => {
      // Cancel - remove the tag element
      document.body.removeChild(tagElement);
      disableTagDrag();
    });
    
    // Focus the textarea
    commentInput.focus();
  };

  // Function to make an element draggable
  const makeDraggable = (element: HTMLElement, handle: HTMLElement) => {
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    
    handle.style.cursor = 'move';
    
    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      const rect = element.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      element.style.opacity = '0.8';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        element.style.opacity = '1';
      }
    });
  };

  // Function to enable image upload via drag and drop
  const enableImageUpload = (container: HTMLElement) => {
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      container.classList.add('bg-blue-50');
    });
    
    container.addEventListener('dragleave', () => {
      container.classList.remove('bg-blue-50');
    });
    
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      container.classList.remove('bg-blue-50');
      
      // Check if files were dropped
      if (e.dataTransfer?.files.length) {
        const files = e.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          // Only allow images
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
              // Create image preview
              const imgPreview = document.createElement('div');
              imgPreview.className = 'flex items-center gap-2 p-2 bg-gray-50 border-t border-gray-200';
              imgPreview.innerHTML = `
                <img src="${event.target?.result}" class="h-10 w-10 object-cover rounded" />
                <div class="text-sm text-gray-700 flex-1">${file.name}</div>
                <button class="text-gray-500 hover:text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              `;
              
              container.appendChild(imgPreview);
              
              // Add click event for remove button
              const removeButton = imgPreview.querySelector('button');
              removeButton?.addEventListener('click', () => {
                container.removeChild(imgPreview);
              });
            };
            reader.readAsDataURL(file);
          }
        }
      }
    });
    
    // Add an upload button
    const uploadButtonContainer = document.createElement('div');
    uploadButtonContainer.className = 'p-2 border-t border-gray-200';
    
    const uploadButton = document.createElement('button');
    uploadButton.className = 'text-sm text-blue-600 flex items-center gap-1 hover:text-blue-800';
    uploadButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
      </svg>
      Upload image
    `;
    
    uploadButtonContainer.appendChild(uploadButton);
    container.appendChild(uploadButtonContainer);
    
    // Create hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    container.appendChild(fileInput);
    
    // Attach click handler to upload button
    uploadButton.addEventListener('click', () => {
      fileInput.click();
    });
    
    // Handle file selection
    fileInput.addEventListener('change', () => {
      if (fileInput.files?.length) {
        const file = fileInput.files[0];
        
        // Read and display the file
        const reader = new FileReader();
        reader.onload = (event) => {
          // Create image preview
          const imgPreview = document.createElement('div');
          imgPreview.className = 'flex items-center gap-2 p-2 bg-gray-50 border-t border-gray-200';
          imgPreview.innerHTML = `
            <img src="${event.target?.result}" class="h-10 w-10 object-cover rounded" />
            <div class="text-sm text-gray-700 flex-1">${file.name}</div>
            <button class="text-gray-500 hover:text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          `;
          
          // Insert before the upload button
          container.insertBefore(imgPreview, uploadButtonContainer);
          
          // Add click event for remove button
          const removeButton = imgPreview.querySelector('button');
          removeButton?.addEventListener('click', () => {
            container.removeChild(imgPreview);
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Set up event listener for tag placement
  useEffect(() => {
    const handleClickForTagPlacement = (e: MouseEvent) => {
      if (tagDragEnabled && e.target instanceof HTMLElement) {
        handleTagPlacement(e as unknown as React.MouseEvent);
      }
    };
    
    document.addEventListener('click', handleClickForTagPlacement);
    
    return () => {
      document.removeEventListener('click', handleClickForTagPlacement);
    };
  }, [tagDragEnabled]);

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
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Activity Dashboard</h3>
                  <p className="text-xs text-gray-500">
                    View and manage actions from all users. Click on any activity to dismiss or pin important notifications.
                  </p>
                </div>
                <button 
                  className={cn(
                    "text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors",
                    tagDragEnabled 
                      ? "bg-blue-500 text-white hover:bg-blue-600" 
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  )}
                  onClick={tagDragEnabled ? disableTagDrag : enableTagDrag}
                >
                  <Tag className="h-3.5 w-3.5" />
                  {tagDragEnabled ? "Cancel Tag Drop" : "Start Tag Drop"}
                </button>
              </div>
            </div>

            {/* Tag Drop Instructions - only shows when feature is enabled */}
            {showTagDragInstructions && (
              <div className="bg-blue-50 p-3 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Tag Drop Mode Active</span>
                  </div>
                  <button 
                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded"
                    onClick={disableTagDrag}
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Drag this onto any part of the site, then allow a comment feature to other staff.
                  Allow for both users to reply back and forwards. Allow for picture uploads.
                </p>
              </div>
            )}

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
              {activeTab === 'all' && (
                <>
                  <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      NJ
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">New job assigned</h4>
                      <p className="text-gray-700">You have been assigned to job #1234</p>
                      <span className="text-xs text-gray-500">6 hours ago</span>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      QA
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Quote approved</h4>
                      <p className="text-gray-700">Customer approved quote for job #5678</p>
                      <span className="text-xs text-gray-500">7 hours ago</span>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      PR
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Payment received</h4>
                      <p className="text-gray-700">Payment received for invoice #9012</p>
                      <span className="text-xs text-gray-500">9 hours ago</span>
                    </div>
                  </div>

                  <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      TL
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">New message</h4>
                      <p className="text-gray-700">Team leader sent you a message</p>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </>
              )}

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
                  <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      CB
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">New booking request</h4>
                      <p className="text-gray-700">Job #701 - Fence Installation</p>
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
                  <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      TD
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">You were tagged</h4>
                      <p className="text-gray-700">@admin please review quote #998</p>
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
                  
                  <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      CM
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">New comment on Job #556</h4>
                      <p className="text-gray-700">Greg added: "Customer is very satisfied with the work"</p>
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
                  
                  <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      TD
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">New tag drop added</h4>
                      <p className="text-gray-700">Jane tagged a spot on Invoice #1092</p>
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
                  <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      JB
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">job 550 - sally healer</h4>
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
                  
                  <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      GH
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">job556 - greg hearn</h4>
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
                  
                  <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      JG
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">qt 998 - jess grean</h4>
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
                   
                  <div className="p-4 hover:bg-gray-50 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      MF
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Qt 999 - mike fills</h4>
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
                   
                  <div className="p-4 hover:bg-gray-50 flex items-start border-t gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold flex-shrink-0">
                      $
                    </div>
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