
import { LayoutDashboard, BarChart3, Gauge, Network, UserSquare2, Activity } from 'lucide-react';
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
      label: 'Statistics',
      path: '/statistics',
      icon: BarChart3,
    },
    {
      type: 'link' as const,
      label: 'Performance',
      path: '/performance',
      icon: Gauge,
    },
    {
      type: 'link' as const,
      label: 'Networks',
      path: '/networks',
      icon: Network,
    },
    {
      type: 'link' as const,
      label: 'Customers',
      path: '/customers',
      icon: UserSquare2,
    },
    {
      type: 'link' as const,
      label: 'Activity',
      path: '/activity',
      icon: Activity,
    },
  ] as NavigationItem[],
};
