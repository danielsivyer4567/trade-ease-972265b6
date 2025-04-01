
import { LayoutDashboard, BarChart3, Gauge, Network, UserSquare2, Activity } from 'lucide-react';

export const overviewNavigation = {
  label: 'Overview',
  items: [
    {
      type: 'link',
      label: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
    },
    // Removing the second dashboard button that was here
    {
      type: 'link',
      label: 'Statistics',
      path: '/statistics',
      icon: BarChart3,
    },
    {
      type: 'link',
      label: 'Performance',
      path: '/performance',
      icon: Gauge,
    },
    {
      type: 'link',
      label: 'Networks',
      path: '/networks',
      icon: Network,
    },
    {
      type: 'link',
      label: 'Customers',
      path: '/customers',
      icon: UserSquare2,
    },
    {
      type: 'link',
      label: 'Activity',
      path: '/activity',
      icon: Activity,
    },
  ],
};
