
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface Tab {
  id: string;
  title: string;
  path: string;
  icon?: React.ReactNode;
}

interface TabsContextType {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Omit<Tab, 'id'> & { id?: string }) => void;
  removeTab: (tabId: string) => void;
  activateTab: (tabId: string) => void;
  isTabOpen: (path: string) => boolean;
  getTabById: (id: string) => Tab | undefined;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Add a new tab - memoized to prevent rerenders
  const addTab = useCallback((tab: Omit<Tab, 'id'> & { id?: string }) => {
    const id = tab.id || `tab-${Date.now()}`;
    const newTab = { ...tab, id };
    
    // Check if tab with same path exists
    const existingTabIndex = tabs.findIndex(t => t.path === tab.path);
    
    if (existingTabIndex >= 0) {
      // Tab exists, activate it
      setActiveTabId(tabs[existingTabIndex].id);
    } else {
      // Create new tab
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
    }
  }, [tabs]);

  // Remove a tab - memoized to prevent rerenders
  const removeTab = useCallback((tabId: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;
    
    // If we're closing the active tab
    if (tabId === activeTabId) {
      // Activate the tab to the left if possible, otherwise the one to the right
      const newActiveIndex = Math.max(0, tabIndex - 1);
      if (tabs.length > 1) {
        const newActiveTab = tabs[newActiveIndex] || tabs[tabIndex + 1];
        setActiveTabId(newActiveTab.id);
        navigate(newActiveTab.path, { replace: true });
      } else {
        setActiveTabId(null);
        navigate('/', { replace: true }); // Default location if no tabs left
      }
    }
    
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
  }, [tabs, activeTabId, navigate]);

  // Activate a tab - memoized to prevent rerenders
  const activateTab = useCallback((tabId: string) => {
    const tab = tabs.find(tab => tab.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      // Use replace instead of push to avoid filling history
      navigate(tab.path, { replace: true });
    }
  }, [tabs, navigate]);

  // Check if a tab with a specific path is already open
  const isTabOpen = useCallback((path: string) => {
    return tabs.some(tab => tab.path === path);
  }, [tabs]);

  // Get a tab by its ID
  const getTabById = useCallback((id: string) => {
    return tabs.find(tab => tab.id === id);
  }, [tabs]);

  // Value object for provider
  const value = {
    tabs,
    activeTabId,
    addTab,
    removeTab,
    activateTab,
    isTabOpen,
    getTabById
  };

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error('useTabs must be used within a TabsProvider');
  }
  return context;
}
