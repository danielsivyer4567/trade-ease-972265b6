import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, FileText, Settings, Calendar, 
  Network, Share, Bot, Mail, MessageSquare, Link as LinkIcon, 
  Database, Plus, BarChart, ListTodo, Bell, GitBranch, Gauge, Calculator,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '../sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";
import { useIsMobile } from '@/hooks/use-mobile';

// Define a type for the navigation links
export type NavLink = {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  openInNewTab?: boolean;
};

// Main navigation links
export const primaryNavLinks: NavLink[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Gauge, label: 'Easy Lead Dashboard', path: '/trade-dash' },
  { icon: GitBranch, label: 'Workflow Builder', path: '/workflow' },
  { icon: BarChart, label: 'Statistics', path: '/statistics' },
  { icon: ListTodo, label: 'Task Lists', path: '/tasks' },
  { icon: Briefcase, label: 'Jobs', path: '/jobs' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: FileText, label: 'Quotes', path: '/quotes' },
  { icon: MessageSquare, label: 'Messaging', path: '/messaging' },
  { icon: Mail, label: 'Email', path: '/email' },
  { icon: Bot, label: 'AI Features', path: '/ai-features' },
  { icon: Calculator, label: 'Calculators', path: '/calculators' },
  { icon: Network, label: 'Integrations', path: '/integrations' },
  { icon: Database, label: 'Database', path: '/database' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

interface NavLinkItemProps {
  link: NavLink;
}

export function NavLinkItem({ link }: NavLinkItemProps) {
  const location = useLocation();
  const { state, isCollapsed } = useSidebar();
  const collapsed = isCollapsed ?? (state === "collapsed");
  const isMobileDevice = useIsMobile();
  const { icon: Icon, label, path, openInNewTab = false } = link;
  
  const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  const linkProps = openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
  
  const content = (
    <Link 
      to={path} 
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm transition-colors",
        isActive && "bg-gray-100 text-gray-900 font-medium",
        isMobileDevice && "p-3 min-h-[48px]" // Larger touch target on mobile
      )} 
      {...linkProps}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className={cn("transition-opacity duration-200", collapsed && "hidden lg:hidden")}>
        {label}
      </span>
    </Link>
  );
  
  return collapsed && !isMobileDevice ? (
    <Tooltip>
      <TooltipTrigger asChild>
        {content}
      </TooltipTrigger>
      <TooltipContent side="right">
        {label}
      </TooltipContent>
    </Tooltip>
  ) : (
    <React.Fragment>{content}</React.Fragment>
  );
}

interface SidebarNavLinksProps {
  additionalLinks?: NavLink[];
}

export function SidebarNavLinks({ additionalLinks = [] }: SidebarNavLinksProps) {
  const links = [
    { icon: Bell, label: "Notifications", path: "/notifications" },
    ...primaryNavLinks,
    ...additionalLinks
  ];

  return (
    <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
      <TooltipProvider delayDuration={0}>
        {links.map((link) => (
          <NavLinkItem key={link.path} link={link} />
        ))}
      </TooltipProvider>
    </nav>
  );
}
