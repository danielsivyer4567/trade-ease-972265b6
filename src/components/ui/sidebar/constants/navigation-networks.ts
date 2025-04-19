import { Network, Users } from 'lucide-react';
import { NavigationItem } from '../navigation/NavigationGroup';

export const networksNavigation = {
  label: "",  // No label as shown in the image
  items: [
    {
      type: 'link' as const,
      icon: Network,
      label: 'Networks',
      path: '/networks',
    },
    {
      type: 'link' as const,
      icon: Users,
      label: 'Staff',
      path: '/staff',
    },
  ] as NavigationItem[],
}; 