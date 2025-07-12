import React, { createContext, useContext, useState, useCallback, useRef, useLayoutEffect, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { trackHistoryCall } from '@/utils/performanceMonitor';
import { isCustomerPath, getCustomerTabTitle } from '@/utils/customerNameUtils';

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

// Helper function to generate unique tab IDs
const generateUniqueTabId = (): string => {
  return `tab-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// Helper function to generate tab title from pathname
const generateTabTitle = async (pathname: string): Promise<string> => {
  const { isCustomer, customerId } = isCustomerPath(pathname);
  
  if (isCustomer && customerId) {
    return await getCustomerTabTitle(customerId);
  }
  
  // Fallback to original logic for non-customer paths
  const pathSegments = pathname.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  let title = lastSegment || 'Home';
  return title.charAt(0).toUpperCase() + title.slice(1);
};

// Main provider that decides which implementation to use
export function TabsProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasRouter, setHasRouter] = useState(false);
  
  // Run once on first render to detect router presence
  useEffect(() => {
    try {
      // This is a safer way to detect router presence without using hooks directly
      setHasRouter(true);
      setIsInitialized(true);
    } catch (e) {
      console.warn('React Router not detected, using simplified tabs implementation');
      setHasRouter(false);
      setIsInitialized(true);
    }
  }, []);

  // Don't render anything until initialization is complete
  if (!isInitialized) {
    return null; // Return empty instead of rendering children
  }

  // Always use the no-router version as a fallback if something goes wrong
  try {
    // Attempt to render with router if we think it's available
    if (hasRouter) {
      return <TabsProviderWithRouter>{children}</TabsProviderWithRouter>;
    }
  } catch (e) {
    console.error('Failed to render tabs with router, falling back to no-router mode', e);
  }
  
  // Fallback to no-router mode
  return <TabsProviderNoRouter>{children}</TabsProviderNoRouter>;
}

// Inner tabs provider that uses React Router
function TabsProviderWithRouter({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const initialized = useRef(false);
  const [navigationInProgress, setNavigationInProgress] = useState(false);
  const mountedRef = useRef(false);
  
  // Try/catch blocks around each hook to safely handle missing router context
  let navigate: any, location: any;
  try {
    navigate = useNavigate();
  } catch (e) {
    console.error('Error accessing navigate hook:', e);
  }
  
  try {
    location = useLocation();
  } catch (e) {
    console.error('Error accessing location hook:', e);
    location = { pathname: window.location.pathname }; // Fallback
  }

  // Track when component is mounted
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Initialize with current path on first mount - use regular useEffect to avoid render blocking
  useEffect(() => {
    if (!initialized.current && location?.pathname && mountedRef.current) {
      initialized.current = true;
      
      // Create a default tab for the current location
      const defaultTabId = generateUniqueTabId();
      
      // Generate title asynchronously
      generateTabTitle(location.pathname).then(title => {
        if (mountedRef.current) {
          const initialTab = { 
            id: defaultTabId, 
            title, 
            path: location.pathname 
          };
          
          // Use requestAnimationFrame to ensure state update happens after render
          requestAnimationFrame(() => {
            if (mountedRef.current) {
              setTabs([initialTab]);
              setActiveTabId(defaultTabId);
            }
          });
        }
      }).catch(error => {
        console.warn('Failed to generate initial tab title, using fallback:', error);
        // Fallback to simple title generation
        const pathSegments = location.pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        let title = lastSegment || 'Home';
        title = title.charAt(0).toUpperCase() + title.slice(1);
        
        if (mountedRef.current) {
          const initialTab = { 
            id: defaultTabId, 
            title, 
            path: location.pathname 
          };
          
          requestAnimationFrame(() => {
            if (mountedRef.current) {
              setTabs([initialTab]);
              setActiveTabId(defaultTabId);
            }
          });
        }
      });
    }
  }, [location?.pathname]);

  // Update tabs when location changes (external navigation)
  useEffect(() => {
    // Only handle navigation updates when initialized and not during active navigation
    if (!navigationInProgress && initialized.current && location?.pathname && mountedRef.current) {
      // Use requestAnimationFrame to prevent state updates during render
      requestAnimationFrame(() => {
        if (!mountedRef.current) return;
        
        setTabs(currentTabs => {
          // Check if this path is already open in a tab
          const existingTabIndex = currentTabs.findIndex(tab => tab.path === location.pathname);
          
          if (existingTabIndex >= 0) {
            // Path exists in a tab, just activate it
            const existingTab = currentTabs[existingTabIndex];
            // Schedule the active tab update for the next frame
            requestAnimationFrame(() => {
              if (mountedRef.current) {
                setActiveTabId(existingTab.id);
              }
            });
            return currentTabs; // No change to tabs
          } else if (location.pathname !== '/') {
            // New path, create a new tab with async title generation
            const newTabId = generateUniqueTabId();
            
            // Generate title asynchronously and update tab
            generateTabTitle(location.pathname).then(title => {
              if (mountedRef.current) {
                setTabs(prevTabs => {
                  // Check if tab was already added by another process
                  const existingTab = prevTabs.find(tab => tab.path === location.pathname);
                  if (existingTab) {
                    return prevTabs;
                  }
                  
                  const newTab = {
                    id: newTabId,
                    title,
                    path: location.pathname
                  };
                  
                  // Schedule the active tab update for the next frame
                  requestAnimationFrame(() => {
                    if (mountedRef.current) {
                      setActiveTabId(newTab.id);
                    }
                  });
                  
                  return [...prevTabs, newTab];
                });
              }
            }).catch(error => {
              console.warn('Failed to generate tab title, using fallback:', error);
              // Fallback to simple title generation
              const pathSegments = location.pathname.split('/');
              const lastSegment = pathSegments[pathSegments.length - 1];
              let title = lastSegment || 'Home';
              title = title.charAt(0).toUpperCase() + title.slice(1);
              
              if (mountedRef.current) {
                setTabs(prevTabs => {
                  const newTab = {
                    id: newTabId,
                    title,
                    path: location.pathname
                  };
                  
                  requestAnimationFrame(() => {
                    if (mountedRef.current) {
                      setActiveTabId(newTab.id);
                    }
                  });
                  
                  return [...prevTabs, newTab];
                });
              }
            });
            
            // Return current tabs for now, they'll be updated when the async title resolves
            return currentTabs;
          }
          
          return currentTabs; // No change
        });
      });
    }
  }, [location?.pathname, navigationInProgress]);

  // Navigation completion handler
  useEffect(() => {
    if (navigationInProgress) {
      // Reset navigation flag after a short delay
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          setNavigationInProgress(false);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [navigationInProgress]);

  // Add a new tab - memoized to prevent rerenders
  const addTab = useCallback((tab: Omit<Tab, 'id'> & { id?: string }) => {
    if (navigationInProgress || !mountedRef.current) return;
    
    const id = tab.id || generateUniqueTabId();
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
    if (navigationInProgress || !navigate || !mountedRef.current) return;
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;
    
    // If we're closing the active tab
    if (tabId === activeTabId) {
      // Activate the tab to the left if possible, otherwise the one to the right
      const newActiveIndex = Math.max(0, tabIndex - 1);
      if (tabs.length > 1) {
        const newActiveTab = tabs[newActiveIndex] || tabs[tabIndex + 1];
        setActiveTabId(newActiveTab.id);
        
        if (trackHistoryCall()) {
          setNavigationInProgress(true);
          navigate(newActiveTab.path, { replace: true });
        }
      } else {
        setActiveTabId(null);
        
        if (trackHistoryCall()) {
          setNavigationInProgress(true);
          navigate('/', { replace: true }); // Default location if no tabs left
        }
      }
    }
    
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
  }, [tabs, activeTabId, navigate, navigationInProgress]);

  // Activate a tab - memoized to prevent rerenders
  const activateTab = useCallback((tabId: string) => {
    if (navigationInProgress || !navigate || !mountedRef.current) return;
    
    const tab = tabs.find(tab => tab.id === tabId);
    if (tab && activeTabId !== tabId) {
      setActiveTabId(tabId);
      
      // Only update history if it's safe to do so
      if (trackHistoryCall()) {
        setNavigationInProgress(true);
        // Use replace instead of push to avoid filling history
        navigate(tab.path, { replace: true });
      }
    }
  }, [tabs, navigate, activeTabId, navigationInProgress]);

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

  // Return null if not initialized to prevent rendering before state is set up
  if (!initialized.current) {
    return <div></div>; // Return empty div instead of null to prevent hydration issues
  }

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

// Simplified provider that doesn't rely on router - used when outside Router context
function TabsProviderNoRouter({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // Stub implementations that don't use navigation
  const addTab = useCallback((tab: Omit<Tab, 'id'> & { id?: string }) => {
    const id = tab.id || generateUniqueTabId();
    const newTab = { ...tab, id };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  const removeTab = useCallback((tabId: string) => {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;
    
    if (tabId === activeTabId) {
      const newActiveIndex = Math.max(0, tabIndex - 1);
      if (tabs.length > 1) {
        const newActiveTab = tabs[newActiveIndex] || tabs[tabIndex + 1];
        setActiveTabId(newActiveTab.id);
      } else {
        setActiveTabId(null);
      }
    }
    
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
  }, [tabs, activeTabId]);

  const activateTab = useCallback((tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)) {
      setActiveTabId(tabId);
    }
  }, [tabs]);

  const isTabOpen = useCallback((path: string) => {
    return tabs.some(tab => tab.path === path);
  }, [tabs]);

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
