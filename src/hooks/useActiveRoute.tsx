import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface UseActiveRouteOptions {
  exact?: boolean;
}

/**
 * Hook to determine if a route is active based on the current URL
 * @param path The path to check
 * @param options Options for matching
 * @returns Whether the path is active
 */
export const useActiveRoute = (path: string, options: UseActiveRouteOptions = {}) => {
  const { exact = false } = options;
  const location = useLocation();
  
  return useMemo(() => {
    const currentPath = location.pathname;
    
    if (exact) {
      return currentPath === path;
    }
    
    return currentPath === path || 
      (path !== '/' && currentPath.startsWith(path));
  }, [location.pathname, path, exact]);
}; 