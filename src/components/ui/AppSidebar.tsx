import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, FileText, Settings, Menu, Calendar, Network, Share, Bot, Mail, MessageSquare, Link as LinkIcon, Database, Hammer, Plus, BarChart, ListTodo, Bell, ChevronLeft, ChevronRight, Gauge, GitBranch, Calculator, Percent } from 'lucide-react';
import { useSidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

export function AppSidebar() {
  const [teams] = React.useState([{
    name: 'Red Team',
    color: 'red',
    path: '/team-red'
  }, {
    name: 'Blue Team',
    color: 'blue',
    path: '/team-blue'
  }, {
    name: 'Green Team',
    color: 'green',
    path: '/team-green'
  }]);
  const {
    state,
    toggleSidebar,
    isMobile
  } = useSidebar();
  const location = useLocation();
  const notificationCount = 3;
  const isCollapsed = state === "collapsed";

  const renderNavLink = (icon: React.ReactNode, label: string, path: string, openInNewTab: boolean = false) => {
    const isActive = location.pathname === path || path !== '/' && location.pathname.startsWith(path);
    
    const linkProps = openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {};
    
    const content = <Link to={path} className={cn("flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 text-sm", isActive && "bg-gray-100 text-gray-900 font-medium")} {...linkProps}>
        {icon}
        <span className={cn("transition-opacity duration-200", isCollapsed && "hidden lg:hidden")}>
          {label}
        </span>
      </Link>;
    return isCollapsed && !isMobile ? <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right">
          {label}
        </TooltipContent>
      </Tooltip> : content;
  };

  return <>
      <Button variant="outline" size="icon" className="fixed left-4 top-4 z-40 lg:hidden" onClick={toggleSidebar}>
        <Menu className="#000b20" />
      </Button>

      <div data-state={state} className="#181835">
        <div className="flex flex-col h-full bg-[#181835]">
          <div className="p-4 flex items-center justify-between bg-slate-200">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png" alt="Trade Ease Logo" className="w-8 h-8" />
              <span className={cn("font-semibold text-lg text-gray-900 transition-opacity duration-200", isCollapsed && "opacity-0 lg:hidden")}>
                Trade Ease
              </span>
            </div>
            <Button variant="ghost" size="icon" className="hidden lg:flex h-8 w-8" onClick={toggleSidebar}>
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <nav className="flex-1 p-2 space-y-1 overflow-y-auto bg-slate-200">
            <TooltipProvider delayDuration={0}>
              {renderNavLink(<Bell className="w-4 h-4 flex-shrink-0" />, "Notifications", "/notifications")}

              {[{
              icon: LayoutDashboard,
              label: 'Dashboard',
              path: '/'
            }, {
              icon: Gauge,
              label: 'Easy Lead Dashboard',
              path: '/trade-dash'
            }, {
              icon: GitBranch,
              label: 'Workflow Builder',
              path: '/workflow'
            }, {
              icon: BarChart,
              label: 'Statistics',
              path: '/statistics'
            }, {
              icon: ListTodo,
              label: 'Task Lists',
              path: '/tasks'
            }, {
              icon: Briefcase,
              label: 'Jobs',
              path: '/jobs'
            }, {
              icon: Calendar,
              label: 'Calendar',
              path: '/calendar'
            }, {
              icon: Users,
              label: 'Customers',
              path: '/customers'
            }, {
              icon: FileText,
              label: 'Quotes',
              path: '/quotes'
            }, {
              icon: MessageSquare,
              label: 'Messaging',
              path: '/messaging'
            }, {
              icon: Mail,
              label: 'Email',
              path: '/email'
            }, {
              icon: Bot,
              label: 'AI Features',
              path: '/ai-features'
            }, {
              icon: Calculator,
              label: 'Calculators',
              path: '/calculators'
            }, {
              icon: Network,
              label: 'Integrations',
              path: '/integrations'
            }, {
              icon: Share,
              label: 'Social',
              path: '/social'
            }, {
              icon: LinkIcon,
              label: 'Refer a Friend',
              path: '/referrals'
            }, {
              icon: Database,
              label: 'Database',
              path: '/database'
            }, {
              icon: Settings,
              label: 'Settings',
              path: '/settings'
            }].map(({
              icon: Icon,
              label,
              path,
              openInNewTab
            }) => renderNavLink(<Icon className="w-4 h-4 flex-shrink-0 bg-slate-200" />, label, path, openInNewTab))}
            </TooltipProvider>

            <div className={cn("pt-8", isCollapsed && "hidden lg:hidden")}>
              <div className="mb-2 text-sm font-bold text-black px-2">
                Teams view
              </div>
              {teams.map(team => <Link key={team.name} to={team.path} className={cn("flex items-center gap-2 p-2 rounded-lg text-sm", `hover:bg-${team.color}-50 text-${team.color}-600 hover:text-${team.color}-700`)}>
                  <Hammer className="w-4 h-4 flex-shrink-0" />
                  <span className={cn("transition-opacity duration-200", isCollapsed && "hidden lg:hidden")}>
                    {team.name}
                  </span>
                </Link>)}
              <Link to="/team-new" className={cn("flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-700 text-sm mt-1", isCollapsed && "hidden lg:hidden")}>
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span>Add Team</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>;
}
