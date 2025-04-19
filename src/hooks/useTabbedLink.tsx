import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTabNavigation } from './useTabNavigation';

/**
 * Custom hook to handle direct navigation while maintaining the tab breadcrumb feature
 * It provides a function to handle link clicks that will:
 * 1. Navigate directly to the target path
 * 2. Also add the destination as a tab in the breadcrumb
 */
export const useTabbedLink = () => {
  const navigate = useNavigate();
  const { openInTab } = useTabNavigation();

  /**
   * Navigate to a path while also adding it as a tab
   * @param path The path to navigate to
   * @param title The title for the tab
   * @param id Optional custom ID for the tab
   */
  const navigateWithTab = useCallback((path: string, title: string, id?: string) => {
    // First perform direct navigation
    navigate(path);
    
    // Then add the tab (this may be redundant in some cases due to automatic tab
    // creation in TabsContext, but ensures custom titles are used)
    openInTab(path, title, id);
  }, [navigate, openInTab]);

  /**
   * Create a click handler that navigates to the specified path while adding it as a tab
   * @param path The path to navigate to
   * @param title The title for the tab
   * @param id Optional custom ID for the tab
   */
  const createClickHandler = useCallback((path: string, title: string, id?: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      navigateWithTab(path, title, id);
    };
  }, [navigateWithTab]);

  return {
    navigateWithTab,
    createClickHandler
  };
}; 