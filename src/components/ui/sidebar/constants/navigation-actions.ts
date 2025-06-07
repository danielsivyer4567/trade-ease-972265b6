import { Settings, LogOut, Sun, Moon } from 'lucide-react';
import type { NavigationItem } from '../navigation/NavigationGroup';
import type { NavigationGroup } from './index';

// Actions navigation group (e.g., logout)
export const actionsNavigation: NavigationGroup = {
  label: '',  // No label as shown in the image
  items: [
    {
      type: 'link' as const,
      icon: Settings,
      label: 'Settings',
      path: '/settings',
    },
    {
      type: 'button' as const,
      icon: LogOut,
      label: 'Logout',
      action: 'logout',
    },
  ] as NavigationItem[],
};
