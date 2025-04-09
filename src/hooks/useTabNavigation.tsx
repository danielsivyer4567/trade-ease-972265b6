
import { useCallback } from 'react';
import { useTabs } from '@/contexts/TabsContext';
import { useNavigate } from 'react-router-dom';

export const useTabNavigation = () => {
  const { addTab, activateTab, isTabOpen, tabs } = useTabs();
  const navigate = useNavigate();

  const openInTab = useCallback((path: string, title: string, id?: string) => {
    // First check if we already have this tab open
    if (isTabOpen(path)) {
      // If the tab is already open, just activate it
      const existingTab = tabs.find(tab => tab.path === path);
      if (existingTab) {
        activateTab(existingTab.id);
        return;
      }
    }
    
    // Add a new tab
    addTab({
      id,
      title,
      path,
    });
  }, [addTab, activateTab, isTabOpen, tabs]);

  return { openInTab };
};
