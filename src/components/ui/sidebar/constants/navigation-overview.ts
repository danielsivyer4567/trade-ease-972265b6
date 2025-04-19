import { LayoutDashboard, Briefcase, MessageSquare, UserSquare2 } from 'lucide-react';
import type { NavigationItem } from '../navigation/NavigationGroup';

export const overviewNavigation = {
  label: 'Overview',
  items: [
    {
      type: 'link' as const,
      label: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
    },
    {
      type: 'link' as const,
      label: 'Jobs',
      path: '/jobs',
      icon: Briefcase,
    },
    {
      type: 'link' as const,
      label: 'Messaging',
      path: '/messaging',
      icon: MessageSquare,
    },
    {
      type: 'link' as const,
      label: 'Customers',
      path: '/customers',
      icon: UserSquare2,
    },
  ] as NavigationItem[],
};
