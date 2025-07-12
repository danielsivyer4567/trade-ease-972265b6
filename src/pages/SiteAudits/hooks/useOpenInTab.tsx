
import { useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useTabs } from '@/contexts/TabsContext';

export function useOpenInTab() {
  const { addTab } = useTabs();
  const location = useLocation();

  const openInTab = useCallback((path: string, title: string, id: string) => {
    if (addTab) {
      addTab({
        id,
        title,
        path: path + (location.search || '')
      });
    }
  }, [addTab, location.search]);

  return { openInTab };
}
