import { ShieldCheck } from 'lucide-react';
import type { NavigationItem } from '../navigation/NavigationGroup';

export const complianceNavigation = {
  label: 'Compliance',
  items: [
    {
      type: 'link' as const,
      label: 'Credentials',
      path: '/credentials',
      icon: ShieldCheck,
    },
  ] as NavigationItem[],
}; 