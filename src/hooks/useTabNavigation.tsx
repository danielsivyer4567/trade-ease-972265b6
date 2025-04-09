
import { useCallback } from 'react';
import { useTabs } from '@/contexts/TabsContext';
import { useNavigate } from 'react-router-dom';

export const useTabNavigation = () => {
  const { addTab, activateTab } = useTabs();
  const navigate = useNavigate();

  const openInTab = useCallback((path: string, title: string, key: string) => {
    if (addTab) {
      addTab({
        key,
        title,
        path,
      });
    } else {
      // Fallback to regular navigation if tab context is not available
      navigate(path);
    }
  }, [addTab, navigate]);

  return { openInTab };
};
