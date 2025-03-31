
import { useEffect, useState } from 'react';
import { TeamMember } from '@/components/ui/tag/types';
import { createPortal } from 'react-dom';
import { TagForm } from '@/components/ui/tag/TagForm';
import { useNotificationPanelState, setNotificationPanelState } from '@/hooks/useNotificationPanelState';
import { toast } from 'sonner';

let activeTagPortal: HTMLDivElement | null = null;

export function useDraggableTag() {
  const [isDragging, setIsDragging] = useState(false);
  const [tagPosition, setTagPosition] = useState({ x: 0, y: 0 });
  const [tagUser, setTagUser] = useState<TeamMember | null>(null);
  const [showTagForm, setShowTagForm] = useState(false);

  // Allow dragging the tag anywhere on the page
  useEffect(() => {
    if (!isDragging) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      
      if (activeTagPortal) {
        activeTagPortal.style.display = 'block';
        activeTagPortal.style.left = `${e.clientX}px`;
        activeTagPortal.style.top = `${e.clientY}px`;
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      if (tagUser) {
        setTagPosition({
          x: e.clientX,
          y: e.clientY
        });
        setShowTagForm(true);
      }
      
      setIsDragging(false);
      if (activeTagPortal) {
        document.body.removeChild(activeTagPortal);
        activeTagPortal = null;
      }
    };

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [isDragging, tagUser]);

  const startTagging = (e: React.DragEvent, user: TeamMember) => {
    e.dataTransfer.setData('text/plain', user.id.toString());
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create a visual element that follows the cursor
    const portal = document.createElement('div');
    portal.className = 'fixed z-50 pointer-events-none bg-primary/10 p-2 rounded-full shadow-lg';
    portal.innerHTML = `<div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">${user.name.substring(0, 2).toUpperCase()}</div>`;
    portal.style.position = 'fixed';
    portal.style.left = `${e.clientX}px`;
    portal.style.top = `${e.clientY}px`;
    portal.style.transition = 'transform 0.1s ease';
    portal.style.transform = 'scale(1.1)';
    document.body.appendChild(portal);
    
    activeTagPortal = portal;
    setTagUser(user);
    setIsDragging(true);
  };

  const handleTagSubmit = async (formData: { comment: string, imageFile: File | null }) => {
    try {
      // In a real app, you would upload the image and save the tag data
      const newTag = {
        id: Date.now(),
        userId: tagUser?.id || 0,
        userName: tagUser?.name || '',
        userAvatar: tagUser?.avatar || '',
        x: tagPosition.x,
        y: tagPosition.y,
        comment: formData.comment,
        imageUrl: formData.imageFile ? URL.createObjectURL(formData.imageFile) : undefined,
        createdAt: new Date().toISOString(),
        pageUrl: window.location.pathname
      };
      
      // Add to notifications (demo)
      addTagToNotifications(newTag);
      
      setShowTagForm(false);
      toast.success(`Tagged ${tagUser?.name} successfully!`);
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag. Please try again.');
    }
  };

  const cancelTagging = () => {
    setShowTagForm(false);
  };

  // Demo function to add tag to notifications
  const addTagToNotifications = (tag: any) => {
    // This would normally connect to your notification system
    // For demo purposes, we'll just open the notification panel
    setTimeout(() => {
      setNotificationPanelState({ isOpen: true });
    }, 1000);
  };

  return {
    startTagging,
    isDragging,
    tagPosition,
    tagUser,
    showTagForm,
    handleTagSubmit,
    cancelTagging,
    TagFormPortal: showTagForm ? 
      createPortal(
        <TagForm 
          position={tagPosition} 
          user={tagUser} 
          onSubmit={handleTagSubmit}
          onCancel={cancelTagging}
        />, 
        document.body
      ) : null
  };
}

// Add this component to your layout or pages where you want tagging enabled
export function TagSystem() {
  const { TagFormPortal } = useDraggableTag();
  return <>{TagFormPortal}</>;
}
