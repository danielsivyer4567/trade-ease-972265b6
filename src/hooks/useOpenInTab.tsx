import { useCallback } from 'react';

interface TabsStore {
  [key: string]: {
    path: string;
    title: string;
    id: string;
  };
}

// This would normally interact with a global state management solution like Redux
// For this example, we're using a simple mock implementation
export function useOpenInTab() {
  // Function to create or update a tab
  const openInTab = useCallback((path: string, title: string, id: string) => {
    // In a real implementation, this would update a global store
    // For now it's just a mock implementation
    console.log('Opening tab:', { path, title, id });
    
    // You can expand this with actual tab management functionality
    // For example, using localStorage to persist tabs
    const existingTabs = localStorage.getItem('openTabs');
    const tabs: TabsStore = existingTabs ? JSON.parse(existingTabs) : {};
    
    // Update or add the tab
    tabs[id] = { path, title, id };
    
    // Save back to localStorage
    localStorage.setItem('openTabs', JSON.stringify(tabs));
    
    return true;
  }, []);

  // Function to close a tab
  const closeTab = useCallback((id: string) => {
    // In a real implementation, this would update a global store
    console.log('Closing tab:', id);
    
    // Remove from localStorage
    const existingTabs = localStorage.getItem('openTabs');
    if (existingTabs) {
      const tabs: TabsStore = JSON.parse(existingTabs);
      delete tabs[id];
      localStorage.setItem('openTabs', JSON.stringify(tabs));
    }
    
    return true;
  }, []);

  // Function to get all open tabs
  const getOpenTabs = useCallback(() => {
    const existingTabs = localStorage.getItem('openTabs');
    return existingTabs ? JSON.parse(existingTabs) : {};
  }, []);

  return {
    openInTab,
    closeTab,
    getOpenTabs
  };
} 