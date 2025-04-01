
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  FileSearch,
  ListTodo,
  ClipboardList,
  TrendingUp,
} from 'lucide-react';
import { NavigationGroup, NavigationLink } from './navigation-types';

// Overview navigation group
export const overviewNavigation: NavigationGroup = {
  label: 'Overview',
  items: [
    {
      type: 'link' as const,
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/',
    },
    {
      type: 'link' as const,
      icon: TrendingUp,
      label: 'Trade Dashboard',
      path: '/tradedash',
    },
    {
      type: 'link' as const,
      icon: Briefcase,
      label: 'Jobs',
      path: '/jobs',
    },
    {
      type: 'link' as const,
      icon: Calendar,
      label: 'Calendar',
      path: '/calendar',
    },
    {
      type: 'link' as const,
      icon: FileSearch,
      label: 'Site Audits',
      path: '/site-audits',
    },
    {
      type: 'link' as const,
      icon: ListTodo,
      label: 'Tasks',
      path: '/tasks',
    },
    {
      type: 'link' as const,
      icon: ClipboardList,
      label: 'Forms',
      path: '/forms',
    },
  ],
};
