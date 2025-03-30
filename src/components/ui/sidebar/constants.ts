
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Briefcase, 
  Calculator,
  Mail,
  MessageSquare,
  Settings,
  Bell,
  Users2,
  Brain,
  Boxes,
  CheckSquare,
  BarChart,
  LogOut,
  Facebook,
  Instagram,
  Youtube,
  Store,
  Share2,
  Receipt,
  FileSearch
} from 'lucide-react';

// Define sidebar constants
export const SIDEBAR_CONSTANTS = {
  SIDEBAR_COOKIE_NAME: "sidebar:state",
  SIDEBAR_COOKIE_MAX_AGE: 60 * 60 * 24 * 7,
  SIDEBAR_WIDTH: "240px",        // Increased from 16rem for better desktop visibility
  SIDEBAR_WIDTH_MOBILE: "280px", // Slightly wider on mobile for better touch targets
  SIDEBAR_WIDTH_ICON: "60px",    // Increased for better icon visibility in collapsed state
  SIDEBAR_KEYBOARD_SHORTCUT: "b",
  MOBILE_BREAKPOINT: 768,
  Z_INDEX: {
    SIDEBAR: 10,
    TRIGGER: 20
  }
};

export const navigationGroups = [
  {
    label: "Main",
    items: [
      {
        type: 'link',
        icon: Bell,
        label: "Notifications",
        path: "/notifications"
      },
      {
        type: 'link',
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/"
      },
      {
        type: 'link',
        icon: BarChart,
        label: "TradeDash",
        path: "/tradedash"
      }
    ]
  },
  {
    label: "Work",
    items: [
      {
        type: 'link',
        icon: Users,
        label: "Customer Portfolio",
        path: "/customers"
      },
      {
        type: 'link',
        icon: Calendar,
        label: "Calendar",
        path: "/calendar"
      },
      {
        type: 'link',
        icon: Briefcase,
        label: "Jobs",
        path: "/jobs"
      },
      {
        type: 'link',
        icon: Receipt,
        label: "Quotes & Invoicing",
        path: "/quotes-invoices"
      },
      {
        type: 'link',
        icon: FileSearch,
        label: "Site Audits",
        path: "/site-audits"
      }
    ]
  },
  {
    label: "Tools",
    items: [
      {
        type: 'link',
        icon: Calculator,
        label: "Calculators",
        path: "/calculators"
      }
    ]
  },
  {
    label: "Communication",
    items: [
      {
        type: 'link',
        icon: MessageSquare,
        label: "Messaging",
        path: "/messaging"
      }
    ]
  },
  {
    label: "System",
    items: [
      {
        type: 'link',
        icon: Settings,
        label: "Settings",
        path: "/settings"
      },
      {
        type: 'button',
        icon: LogOut,
        label: "Logout",
        action: 'logout'
      }
    ]
  }
];

// Define the team links that will be shown only on the Teams page
export const teamLinks = [
  {
    icon: Users2,
    label: "Team Red",
    path: "/team-red",
    color: "red"
  },
  {
    icon: Users2,
    label: "Team Blue",
    path: "/team-blue",
    color: "blue"
  },
  {
    icon: Users2,
    label: "Team Green",
    path: "/team-green",
    color: "green"
  }
];

// Calendar team links that will be shown only on the Calendar page
export const calendarTeamLinks = [
  {
    icon: Users2,
    label: "All Teams",
    path: "/calendar",
    color: "gray"
  },
  {
    icon: Users2,
    label: "Team Red",
    path: "/team-red",
    color: "red"
  },
  {
    icon: Users2,
    label: "Team Blue",
    path: "/team-blue",
    color: "blue"
  },
  {
    icon: Users2,
    label: "Team Green",
    path: "/team-green",
    color: "green"
  }
];
