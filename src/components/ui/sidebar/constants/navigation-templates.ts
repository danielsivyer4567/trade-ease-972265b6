import { FileText, FileEdit, Calculator, HardHat } from 'lucide-react';
import type { NavigationItem } from '../navigation/NavigationGroup';

export const templatesNavigation = {
  label: 'Templates',
  items: [
    {
      type: 'link' as const,
      icon: HardHat,
      label: 'Construction',
      path: '/templates/construction',
    },
    {
      type: 'link' as const,
      icon: FileText,
      label: 'Construction Quote',
      path: '/templates/construction-quote',
    },
    {
      type: 'link' as const,
      icon: FileEdit,
      label: 'Minimalist Quote',
      path: '/templates/minimalist-quote',
    },
    {
      type: 'link' as const,
      icon: Calculator,
      label: 'Construction Estimate',
      path: '/templates/construction-estimate',
    },
  ] as NavigationItem[],
}; 