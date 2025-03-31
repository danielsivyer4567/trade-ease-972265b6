
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Settings,
  Calendar,
  Network,
  Share,
  Bot,
  Mail,
  MessageSquare,
  Link,
  Database,
  Plus,
  BarChart,
  ListTodo,
  Bell,
  LogOut,
  Calculator,
  FileSearch,
  ClipboardList,
  Workflow,
} from 'lucide-react';

import { NavLink } from './SidebarNavLinks';

export const SIDEBAR_CONSTANTS = {
  SIDEBAR_WIDTH: "240px",
  SIDEBAR_WIDTH_ICON: "64px",
  SIDEBAR_WIDTH_MOBILE: "100%",
  SIDEBAR_COOKIE_NAME: "sidebar-expanded",
  SIDEBAR_COOKIE_MAX_AGE: 60 * 60 * 24 * 365, // 1 year
  SIDEBAR_KEYBOARD_SHORTCUT: "b",
};

export const teamLinks = [
  {
    label: 'Team Red',
    color: 'red',
    icon: Users,
    path: '/team-red',
  },
  {
    label: 'Team Blue',
    color: 'blue',
    icon: Users,
    path: '/team-blue',
  },
  {
    label: 'Team Green',
    color: 'green',
    icon: Users,
    path: '/team-green',
  },
];

export const calendarTeamLinks = [
  {
    label: 'Team Red Calendar',
    color: 'red',
    icon: Calendar,
    path: '/calendar/team/red',
  },
  {
    label: 'Team Blue Calendar',
    color: 'blue',
    icon: Calendar,
    path: '/calendar/team/blue',
  },
  {
    label: 'Team Green Calendar',
    color: 'green',
    icon: Calendar,
    path: '/calendar/team/green',
  },
];

export const navigationGroups = [
  {
    label: 'Overview',
    items: [
      {
        type: 'link',
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/',
      },
      {
        type: 'link',
        icon: Briefcase,
        label: 'Jobs',
        path: '/jobs',
      },
      {
        type: 'link',
        icon: Calendar,
        label: 'Calendar',
        path: '/calendar',
      },
      {
        type: 'link',
        icon: FileSearch,
        label: 'Site Audits',
        path: '/site-audits',
      },
      {
        type: 'link',
        icon: ListTodo,
        label: 'Tasks',
        path: '/tasks',
      },
      {
        type: 'link',
        icon: ClipboardList,
        label: 'Forms',
        path: '/forms',
      },
    ],
  },
  {
    label: 'Business',
    items: [
      {
        type: 'link',
        icon: Users,
        label: 'Customers',
        path: '/customers',
      },
      {
        type: 'link',
        icon: FileText,
        label: 'Quotes',
        path: '/quotes',
      },
      {
        type: 'link',
        icon: Share,
        label: 'Referrals',
        path: '/referrals',
      },
      {
        type: 'link',
        icon: BarChart,
        label: 'Statistics',
        path: '/statistics',
      },
      {
        type: 'dropdown',
        icon: Calculator,
        label: 'Calculators',
        items: [
          {
            icon: Plus,
            label: 'Markup Calculator',
            path: '/calculators/markup',
          },
          {
            icon: Plus,
            label: 'Job Cost Calculator',
            path: '/calculators/job-cost',
          },
        ],
      },
    ],
  },
  {
    label: 'Communication',
    items: [
      {
        type: 'link',
        icon: Bell,
        label: 'Notifications',
        path: '/notifications',
      },
      {
        type: 'link',
        icon: Mail,
        label: 'Email',
        path: '/email',
      },
      {
        type: 'link',
        icon: MessageSquare,
        label: 'Messaging',
        path: '/messaging',
      },
    ],
  },
  {
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
        icon: Workflow,
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
  },
  {
    items: [
      {
        type: 'button',
        icon: LogOut,
        label: 'Logout',
        action: 'logout',
      },
    ],
  },
];
