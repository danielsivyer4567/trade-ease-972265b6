
import { LogOut } from 'lucide-react';
import type { NavigationItem } from '../navigation/NavigationGroup';
import type { NavigationGroup } from './index';

// Actions navigation group (e.g., logout)
export const actionsNavigation: NavigationGroup = {
  items: [
    {
      type: 'button' as const,
      icon: LogOut,
      label: 'Logout',
      action: 'logout',
    } as NavigationItem,
  ],
};
