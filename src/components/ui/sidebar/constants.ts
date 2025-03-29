
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Briefcase, 
  Calculator,
  Mail,
  MessageSquare,
  Settings,
  LineChart,
  Database,
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
  Share2
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
        label: "Customers",
        path: "/customers"
      },
      {
        type: 'link',
        icon: Calendar,
        label: "Calendar",
        path: "/calendar"
      },
      {
        type: 'dropdown',
        icon: Briefcase,
        label: "Jobs",
        items: [
          {
            icon: Briefcase,
            label: "All Jobs",
            path: "/jobs"
          },
          {
            icon: CheckSquare,
            label: "Tasks",
            path: "/tasks"
          }
        ]
      }
    ]
  },
  {
    label: "Teams",
    items: [
      {
        type: 'link',
        icon: Users2,
        label: "All Teams",
        path: "/teams"
      },
      {
        type: 'link',
        icon: Users2,
        label: "Team Red",
        path: "/team-red"
      },
      {
        type: 'link',
        icon: Users2,
        label: "Team Blue",
        path: "/team-blue"
      },
      {
        type: 'link',
        icon: Users2,
        label: "Team Green",
        path: "/team-green"
      }
    ]
  },
  {
    label: "Social Media",
    items: [
      {
        type: 'link',
        icon: Share2,
        label: "Social",
        path: "/social"
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
      },
      {
        type: 'link',
        icon: Brain,
        label: "AI Features",
        path: "/ai-features"
      }
    ]
  },
  {
    label: "Communication",
    items: [
      {
        type: 'link',
        icon: Mail,
        label: "Email",
        path: "/email"
      },
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
        icon: LineChart,
        label: "Statistics",
        path: "/statistics"
      },
      {
        type: 'link',
        icon: Database,
        label: "Database",
        path: "/database"
      },
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
