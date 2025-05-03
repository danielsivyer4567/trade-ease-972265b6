import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate as useReactRouterNavigate, useLocation as useReactRouterLocation, NavigateFunction } from 'react-router-dom';
import { trackHistoryCall } from '@/utils/performanceMonitor';

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

// Safe hook that works outside Router context
function useSafeNavigate(): NavigateFunction | null {
  try {
    return useReactRouterNavigate();
  } catch (error) {
    console.warn('useNavigate used outside Router context - navigation disabled');
    return null;
  }
}

// Safe hook for location that works outside Router context
function useSafeLocation() {
  try {
    return useReactRouterLocation();
  } catch (error) {
    console.warn('useLocation used outside Router context - using default location');
    return { pathname: '/' };
  }
}

export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const initialized = useRef(false);
  const [navigationInProgress, setNavigationInProgress] = useState(false);
  const navigate = useSafeNavigate();
  const location = useSafeLocation();

  // Initialize with current path on first mount
  useEffect(() => {
    if (!initialized.current && location.pathname) {
      // Create a default tab for the current location
      const defaultTabId = `tab-${Date.now()}`;
      const pathSegments = location.pathname.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      
      // Generate a title from the path
      let title = lastSegment || 'Home';
      title = title.charAt(0).toUpperCase() + title.slice(1);
      
      setTabs([{ 
        id: defaultTabId, 
        title, 
        path: location.pathname 
      }]);
      
      setActiveTabId(defaultTabId);
      initialized.current = true;
    }
  }, [location.pathname]);

  // Throttle function to prevent excessive calls
  const throttle = useCallback((callback: Function, delay: number = 300) => {
    let timeoutId: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
      if (timeoutId) {
        return;
      }
      
      timeoutId = setTimeout(() => {
        callback(...args);
        timeoutId = null;
      }, delay);
    };
  }, []);

  // Add a new tab - memoized to prevent rerenders
  const addTab = useCallback((tab: Omit<Tab, 'id'> & { id?: string }) => {
    if (navigationInProgress) return;
    
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
  }, [tabs, navigationInProgress]);

  // Remove a tab - memoized to prevent rerenders
  const removeTab = useCallback((tabId: string) => {
    if (navigationInProgress) return;
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;
    
    // If we're closing the active tab
    if (tabId === activeTabId) {
      // Activate the tab to the left if possible, otherwise the one to the right
      const newActiveIndex = Math.max(0, tabIndex - 1);
      if (tabs.length > 1) {
        const newActiveTab = tabs[newActiveIndex] || tabs[tabIndex + 1];
        setActiveTabId(newActiveTab.id);
        
        if (trackHistoryCall() && navigate) {
          setNavigationInProgress(true);
          navigate(newActiveTab.path, { replace: true });
        }
      } else {
        setActiveTabId(null);
        
        if (trackHistoryCall() && navigate) {
          setNavigationInProgress(true);
          navigate('/', { replace: true }); // Default location if no tabs left
        }
      }
    }
    
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
  }, [tabs, activeTabId, navigate, navigationInProgress]);

  // Activate a tab - memoized to prevent rerenders
  const activateTab = useCallback((tabId: string) => {
    if (navigationInProgress) return;
    
    const tab = tabs.find(tab => tab.id === tabId);
    if (tab && activeTabId !== tabId) {
      setActiveTabId(tabId);
      
      // Only update history if it's safe to do so
      if (trackHistoryCall() && navigate) {
        setNavigationInProgress(true);
        // Use replace instead of push to avoid filling history
        navigate(tab.path, { replace: true });
      }
    }
  }, [tabs, navigate, activeTabId, navigationInProgress]);

  // Navigation completion handler
  useEffect(() => {
    if (navigationInProgress) {
      // Reset navigation flag after a short delay
      const timer = setTimeout(() => {
        setNavigationInProgress(false);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [navigationInProgress, location.pathname]);

  // Update tabs when location changes (external navigation)
  useEffect(() => {
    if (!navigationInProgress && !initialized.current) {
      // Check if this path is already open in a tab
      const existingTabIndex = tabs.findIndex(tab => tab.path === location.pathname);
      
      if (existingTabIndex >= 0) {
        // Path exists in a tab, just activate it
        setActiveTabId(tabs[existingTabIndex].id);
      } else if (location.pathname !== '/') {
        // New path, create a new tab
        const pathSegments = location.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        let title = lastSegment || 'Home';
        title = title.charAt(0).toUpperCase() + title.slice(1);
        
        const newTab = {
          id: `tab-${Date.now()}`,
          title,
          path: location.pathname
        };
        
        setTabs(prev => [...prev, newTab]);
        setActiveTabId(newTab.id);
      }
    }
  }, [location.pathname, navigationInProgress, initialized.current, tabs]);

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
