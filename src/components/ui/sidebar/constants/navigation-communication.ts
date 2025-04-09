
import {
  Bell,
  Mail,
  MessageSquare,
} from 'lucide-react';
import type { NavigationItem } from '../navigation/NavigationGroup';

// Communication navigation group
export const communicationNavigation = {
  label: 'Communication',
  items: [
    {
      type: 'link' as const,
      icon: Bell,
      label: 'Notifications',
      path: '/notifications',
    },
    {
      type: 'link' as const,
      icon: Mail,
      label: 'Email',
      path: '/email',
    },
    {
      type: 'link' as const,
      icon: MessageSquare,
      label: 'Messaging',
      path: '/messaging',
    },
  ] as NavigationItem[],
};
