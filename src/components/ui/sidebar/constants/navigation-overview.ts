
import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  FileSearch,
  ListTodo,
  ClipboardList,
  TrendingUp,
} from 'lucide-react';

// Overview navigation group
export const overviewNavigation = {
  label: 'Overview',
  items: [
    {
      type: 'link',
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/',
    },
    {
      type: 'link',
      icon: TrendingUp,
      label: 'Trade Dashboard',
      path: '/tradedash',
    },
    {
      type: 'link',
      icon: Briefcase,
      label: 'Jobs',
      path: '/jobs',
    },
    {
      type: 'link',
      icon: Calendar,
      label: 'Calendar',
      path: '/calendar',
    },
    {
      type: 'link',
      icon: FileSearch,
      label: 'Site Audits',
      path: '/site-audits',
    },
    {
      type: 'link',
      icon: ListTodo,
      label: 'Tasks',
      path: '/tasks',
    },
    {
      type: 'link',
      icon: ClipboardList,
      label: 'Forms',
      path: '/forms',
    },
  ],
};
