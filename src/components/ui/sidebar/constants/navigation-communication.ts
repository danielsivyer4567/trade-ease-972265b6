
import {
  Bell,
  Mail,
  MessageSquare,
} from 'lucide-react';

// Communication navigation group
export const communicationNavigation = {
  label: 'Communication',
  items: [
    {
      type: 'link',
      icon: Bell,
      label: 'Notifications',
      path: '/notifications',
    },
    {
      type: 'link',
      icon: Mail,
      label: 'Email',
      path: '/email',
    },
    {
      type: 'link',
      icon: MessageSquare,
      label: 'Messaging',
      path: '/messaging',
    },
  ],
};
