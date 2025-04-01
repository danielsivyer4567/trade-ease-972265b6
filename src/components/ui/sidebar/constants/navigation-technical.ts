
import {
  Bot,
  Network,
  Database,
  Link,
  Workflow,
  ChevronRightSquare,
  Settings,
} from 'lucide-react';
import { NavigationGroup, NavigationLink } from './navigation-types';

// Technical navigation group
export const technicalNavigation: NavigationGroup = {
  label: 'Technical',
  items: [
    {
      type: 'link' as const,
      icon: Bot,
      label: 'AI Features',
      path: '/ai-features',
    },
    {
      type: 'link' as const,
      icon: Network,
      label: 'Integrations',
      path: '/integrations',
    },
    {
      type: 'link' as const,
      icon: Database,
      label: 'Database',
      path: '/database',
    },
    {
      type: 'link' as const,
      icon: Link,
      label: 'Property Boundaries',
      path: '/property-boundaries',
    },
    {
      type: 'link' as const,
      icon: Workflow,
      label: 'Automations',
      path: '/automations',
    },
    {
      type: 'link' as const,
      icon: ChevronRightSquare,
      label: 'Workflow',
      path: '/workflow',
    },
    {
      type: 'link' as const,
      icon: Settings,
      label: 'Settings',
      path: '/settings',
    },
  ],
};
