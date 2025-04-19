import { 
  Database,
  Map,
  ChevronRightSquare,
  Calculator
} from 'lucide-react';
import { NavigationItem } from '../navigation/NavigationGroup';

export const technicalNavigation = {
  label: 'Technical',
  items: [
    {
      type: 'link' as const,
      icon: Database,
      label: 'Database',
      path: '/database',
    },
    {
      type: 'link' as const,
      icon: Map,
      label: 'Property Boundaries',
      path: '/property-boundaries',
    },
    {
      type: 'link' as const,
      icon: ChevronRightSquare,
      label: 'Workflow',
      path: '/workflow',
    },
    {
      type: 'link' as const,
      icon: Calculator,
      label: 'Calculators',
      path: '/calculators'
    }
  ] as NavigationItem[],
};
