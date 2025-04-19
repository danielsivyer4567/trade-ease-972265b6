import { useCallback, useState } from 'react';
import { atom, useAtom } from 'jotai';
import { useNavigate } from 'react-router-dom';
import { useTabNavigation } from './useTabNavigation';

// Global state for whether tab direct navigation is enabled
const directTabNavigationEnabledAtom = atom<boolean>(false);

/**
 * A hook that provides functions to toggle and use direct tab navigation functionality
 * When direct navigation is disabled, users must click a button first, then click the tab
 */
export const useDirectTabNavigation = () => {
  const navigate = useNavigate();
  const { openInTab } = useTabNavigation();
  const [directNavigationEnabled, setDirectNavigationEnabled] = useAtom(directTabNavigationEnabledAtom);
  const [targetPath, setTargetPath] = useState<{ path: string; title: string; id?: string } | null>(null);
  
  // Toggle direct navigation mode
  const toggleDirectNavigation = useCallback(() => {
    setDirectNavigationEnabled(!directNavigationEnabled);
    // Clear target path when toggling off
    if (directNavigationEnabled) {
      setTargetPath(null);
    }
  }, [directNavigationEnabled, setDirectNavigationEnabled]);
  
  // Set the target path (to be used when direct navigation is off)
  const setTabTarget = useCallback((path: string, title: string, id?: string) => {
    setTargetPath({ path, title, id });
  }, []);
  
  // Clear the target path
  const clearTabTarget = useCallback(() => {
    setTargetPath(null);
  }, []);
  
  // Navigate to the target path (when direct navigation is enabled)
  const navigateWithTab = useCallback((path: string, title: string, id?: string) => {
    if (directNavigationEnabled) {
      // Direct navigation - behave like the original useTabbedLink
      navigate(path);
      openInTab(path, title, id);
    } else {
      // Just set the target without navigating
      setTabTarget(path, title, id);
    }
  }, [directNavigationEnabled, navigate, openInTab, setTabTarget]);
  
  // Function to actually execute the navigation after the button is clicked
  const executeNavigation = useCallback(() => {
    if (targetPath) {
      navigate(targetPath.path);
      openInTab(targetPath.path, targetPath.title, targetPath.id);
      setTargetPath(null);
    }
  }, [targetPath, navigate, openInTab]);
  
  // Create a click handler for links
  const createClickHandler = useCallback((path: string, title: string, id?: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      navigateWithTab(path, title, id);
    };
  }, [navigateWithTab]);
  
  return {
    navigateWithTab,
    createClickHandler,
    directNavigationEnabled,
    toggleDirectNavigation,
    targetPath,
    executeNavigation,
    clearTabTarget
  };
}; 