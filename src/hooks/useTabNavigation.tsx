
import { useCallback } from 'react';
import { useTabs } from '@/contexts/TabsContext';
import { useNavigate } from 'react-router-dom';

export const useTabNavigation = () => {
  const { addTab, activateTab, isTabOpen, tabs } = useTabs();
  const navigate = useNavigate();

  const openInTab = useCallback((path: string, title: string, id: string) => {
    // First check if we already have this tab open to prevent duplicate navigation
    if (isTabOpen && isTabOpen(path)) {
      // If the tab is already open, just activate it
      const existingTab = tabs.find(tab => tab.path === path);
      if (existingTab) {
        activateTab(existingTab.id);
        return;
      }
    }
    
    // Only add a new tab if it doesn't exist
    if (addTab) {
      addTab({
        id,
        title,
        path,
      });
    } else {
      // Fallback to regular navigation if tab context is not available
      navigate(path);
    }
  }, [addTab, activateTab, navigate, isTabOpen, tabs]);

  return { openInTab };
};
