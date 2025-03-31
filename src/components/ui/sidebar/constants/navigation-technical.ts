
import {
  Bot,
  Network,
  Database,
  Link,
  Workflow,
  ChevronRightSquare,
  Settings,
} from 'lucide-react';

// Technical navigation group
export const technicalNavigation = {
  label: 'Technical',
  items: [
    {
      type: 'link',
      icon: Bot,
      label: 'AI Features',
      path: '/ai-features',
    },
    {
      type: 'link',
      icon: Network,
      label: 'Integrations',
      path: '/integrations',
    },
    {
      type: 'link',
      icon: Database,
      label: 'Database',
      path: '/database',
    },
    {
      type: 'link',
      icon: Link,
      label: 'Property Boundaries',
      path: '/property-boundaries',
    },
    {
      type: 'link',
      icon: Workflow,
      label: 'Automations',
      path: '/automations',
    },
    {
      type: 'link',
      icon: ChevronRightSquare,
      label: 'Workflow',
      path: '/workflow',
    },
    {
      type: 'link',
      icon: Settings,
      label: 'Settings',
      path: '/settings',
    },
  ],
};
