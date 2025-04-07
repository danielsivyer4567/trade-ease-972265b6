
import { useNavigate } from 'react-router-dom';
import { useTabs } from '@/contexts/TabsContext';

export function useTabNavigation() {
  const navigate = useNavigate();
  const { addTab, activateTab, isTabOpen, tabs } = useTabs();

  const openInTab = (path: string, title: string, id?: string) => {
    // If tab is already open, just activate it
    const existingTab = tabs.find(tab => tab.path === path);
    if (existingTab) {
      activateTab(existingTab.id);
      return;
    }

    // Add new tab
    addTab({
      id,
      title,
      path
    });
    
    // Navigate to the path
    navigate(path);
  };

  return { openInTab };
}
