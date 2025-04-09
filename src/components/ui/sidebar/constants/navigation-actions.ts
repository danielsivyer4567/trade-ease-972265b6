
import { LogOut } from 'lucide-react';
import type { NavigationItem } from '../navigation/NavigationGroup';

// Actions navigation group (e.g., logout)
export const actionsNavigation = {
  items: [
    {
      type: 'button' as const,
      icon: LogOut,
      label: 'Logout',
      action: 'logout',
    },
  ] as NavigationItem[],
};
