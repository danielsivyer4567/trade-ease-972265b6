import React, { createContext, useContext, useState, useCallback } from 'react';
import { TagOverlay } from './TagOverlay';
import { useNotifications } from './NotificationContextProvider';

interface TagOverlayContextType {
  showTagOverlay: (tagData: any) => void;
  hideTagOverlay: () => void;
}

const TagOverlayContext = createContext<TagOverlayContextType | undefined>(undefined);

export const useTagOverlay = () => {
  const context = useContext(TagOverlayContext);
  if (!context) {
    throw new Error('useTagOverlay must be used within a TagOverlayProvider');
  }
  return context;
};

interface TagOverlayProviderProps {
  children: React.ReactNode;
}

export const TagOverlayProvider: React.FC<TagOverlayProviderProps> = ({ children }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { openDraggableNotifications } = useNotifications();

  const showTagOverlay = useCallback((tagData: any) => {
    setIsOverlayVisible(true);
  }, []);

  const hideTagOverlay = useCallback(() => {
    setIsOverlayVisible(false);
  }, []);

  const handleReply = useCallback((tagId: string | number) => {
    // Hide the tag overlay first
    hideTagOverlay();
    
    // Open the draggable notifications panel so user can access the tag drop popup
    openDraggableNotifications();
    
    // The workflow is: user clicks notification > sees tag overlay > clicks reply > 
    // notifications panel opens > user can then access tag drop for paint/reply functionality
  }, [hideTagOverlay, openDraggableNotifications]);

  return (
    <TagOverlayContext.Provider value={{ showTagOverlay, hideTagOverlay }}>
      {children}
      <TagOverlay onClose={hideTagOverlay} onReply={handleReply} />
    </TagOverlayContext.Provider>
  );
};

export default TagOverlayProvider;