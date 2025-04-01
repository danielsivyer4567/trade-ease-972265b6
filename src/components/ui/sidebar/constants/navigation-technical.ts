
import {
  Bot,
  Network,
  Database,
  Link,
  Workflow,
  ChevronRightSquare,
  Settings,
  Camera,
  Bell,
  Share2,
} from 'lucide-react';

// Technical navigation group
export const technicalNavigation = {
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
      icon: Camera,
      label: 'Job Photos',
      path: '/automations?category=customer',
    },
    {
      type: 'link' as const,
      icon: Share2,
      label: 'Photo Sharing',
      path: '/automations?category=sharing',
    },
    {
      type: 'link' as const,
      icon: Bell,
      label: 'Notifications',
      path: '/notifications',
    },
    {
      type: 'link' as const,
      icon: Settings,
      label: 'Settings',
      path: '/settings',
    },
  ],
};
