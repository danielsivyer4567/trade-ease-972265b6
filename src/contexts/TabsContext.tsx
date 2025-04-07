
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const navigate = useNavigate();
  const location = useLocation();

  // Add a new tab
  const addTab = (tab: Omit<Tab, 'id'> & { id?: string }) => {
    const id = tab.id || `tab-${Date.now()}`;
    const newTab = { ...tab, id };
    
    // Check if tab with same path exists
    const existingTabIndex = tabs.findIndex(t => t.path === tab.path);
    
    if (existingTabIndex >= 0) {
      // Tab exists, activate it
      activateTab(tabs[existingTabIndex].id);
    } else {
      // Create new tab
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
    }
  };

  // Remove a tab
  const removeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;
    
    // If we're closing the active tab
    if (tabId === activeTabId) {
      // Activate the tab to the left if possible, otherwise the one to the right
      const newActiveIndex = Math.max(0, tabIndex - 1);
      if (tabs.length > 1) {
        const newActiveTab = tabs[newActiveIndex] || tabs[tabIndex + 1];
        setActiveTabId(newActiveTab.id);
        navigate(newActiveTab.path);
      } else {
        setActiveTabId(null);
        navigate('/'); // Default location if no tabs left
      }
    }
    
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
  };

  // Activate a tab
  const activateTab = (tabId: string) => {
    const tab = tabs.find(tab => tab.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      navigate(tab.path);
    }
  };

  // Check if a tab with a specific path is already open
  const isTabOpen = (path: string) => {
    return tabs.some(tab => tab.path === path);
  };

  // Get a tab by its ID
  const getTabById = (id: string) => {
    return tabs.find(tab => tab.id === id);
  };

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
