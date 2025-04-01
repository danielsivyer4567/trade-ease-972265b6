
import { LogOut } from 'lucide-react';
import { NavigationGroup, NavigationButton } from './navigation-types';

// Actions navigation group (e.g., logout)
export const actionsNavigation: NavigationGroup = {
  label: "Account", // Added a label for consistency
  items: [
    {
      type: 'button' as const,
      icon: LogOut,
      label: 'Logout',
      action: 'logout',
    },
  ],
};
