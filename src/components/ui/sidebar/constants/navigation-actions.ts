
import { LogOut } from 'lucide-react';

// Actions navigation group (e.g., logout)
export const actionsNavigation = {
  label: "Account", // Added a label for consistency
  items: [
    {
      type: 'button',
      icon: LogOut,
      label: 'Logout',
      action: 'logout',
    },
  ],
};
