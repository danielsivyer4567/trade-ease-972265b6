
import { useCallback, useRef } from 'react';
import { useTabs } from '@/contexts/TabsContext';
import { useNavigate } from 'react-router-dom';
import { trackHistoryCall } from '@/utils/performanceMonitor';

export const useTabNavigation = () => {
  const { addTab, activateTab, isTabOpen, tabs } = useTabs();
  const navigate = useNavigate();
  const lastNavigationRef = useRef({ path: '', time: 0 });

  const openInTab = useCallback((path: string, title: string, id: string) => {
    // Prevent duplicate navigations within a short timeframe
    const now = Date.now();
    if (
      path === lastNavigationRef.current.path && 
      now - lastNavigationRef.current.time < 500
    ) {
      return;
    }
    
    // Update last navigation record
    lastNavigationRef.current = { path, time: now };
    
    // Prevent continuous reopening of the same tab
    const tabId = id || `tab-${Date.now()}`;
    
    // First check if we already have this tab open to prevent duplicate navigation
    if (isTabOpen && isTabOpen(path)) {
      // If the tab is already open, just activate it
      const existingTab = tabs.find(tab => tab.path === path);
      if (existingTab) {
        activateTab(existingTab.id);
        return;
      }
    }
    
    // Only add a new tab if it doesn't exist and history API is not overloaded
    if (addTab && trackHistoryCall()) {
      addTab({
        id: tabId,
        title,
        path,
      });
    } else {
      // Fallback to regular navigation if tab context is not available
      // or if we're hitting history API limits
      navigate(path);
    }
  }, [addTab, activateTab, navigate, isTabOpen, tabs]);

  return { openInTab };
};
