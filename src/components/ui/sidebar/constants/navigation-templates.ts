import { FileText, FileEdit, Calculator, HardHat, Bug, TestTube } from 'lucide-react';
import type { NavigationItem } from '../navigation/NavigationGroup';

export const templatesNavigation = {
  label: 'Templates',
  items: [
    {
      type: 'link' as const,
      icon: HardHat,
      label: 'Construction',
      path: '/templates',
    },
    {
      type: 'link' as const,
      icon: Calculator,
      label: 'Construction Estimate',
      path: '/templates/construction-estimate',
    },
    {
      type: 'link' as const,
      icon: TestTube,
      label: 'Template Previews',
      path: '/templates/test',
    },
    {
      type: 'link' as const,
      icon: Bug,
      label: 'Debug Templates',
      path: '/templates/debug',
    },
  ] as NavigationItem[],
}; 