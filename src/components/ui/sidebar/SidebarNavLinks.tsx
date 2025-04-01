import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, FileText, Settings, Calendar, Network, Share, Bot, Mail, MessageSquare, Link as LinkIcon, Database, Plus, BarChart, ListTodo, Bell, GitBranch, Gauge, Calculator, LucideIcon, ChevronDown, Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarProvider';
import { Button } from '../button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";
import { ScrollArea } from '../scroll-area';
import { navigationGroups, teamLinks } from './constants';
import { useAuth } from '@/contexts/AuthContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../collapsible';

// Define a type for the navigation links
export type NavLink = {
  icon: LucideIcon;
  label: string;
  path: string;
  openInNewTab?: boolean;
};
interface SidebarNavLinksProps {
  isExpanded?: boolean;
}
export function SidebarNavLinks({
  isExpanded = true
}: SidebarNavLinksProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    signOut
  } = useAuth();
  const isTeamsPage = location.pathname === "/teams";
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  return <nav className="grid gap-1 px-2 py-2">
      {navigationGroups.map((group, index) => <div key={index} className="grid gap-0.5 my-[25px] rounded-full">
          {/* Group Label - Only show if it exists and sidebar is expanded */}
          {isExpanded && 'label' in group && group.label && <h4 className="text-gray-950 font-extrabold text-base">
              {group.label}
            </h4>}

          {/* Regular Links */}
          {group.items.map((item, itemIndex) => {
        if (item.type === 'link') {
          const isActive = location.pathname === item.path;
          const LinkIcon = item.icon;
          const linkButton = <Button key={item.path} asChild variant={isActive ? "secondary" : "ghost"} size="sm" className={cn("w-full justify-start h-9", isExpanded ? "px-2" : "px-2 justify-center", isActive && "bg-white border border-foreground/10")}>
                  <Link to={item.path}>
                    <LinkIcon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    {isExpanded && <span className="ml-2 text-sm">{item.label}</span>}
                  </Link>
                </Button>;
          return isExpanded ? linkButton : <TooltipProvider key={item.path}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {linkButton}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>;
        } else if (item.type === 'button' && item.action === 'logout') {
          const LogoutIcon = item.icon;
          const logoutButton = <Button key="logout" variant="ghost" size="sm" onClick={handleLogout} className="py-[23px] my-0 px-0 text-left mx-[9px] text-2xl text-gray-950 rounded-lg bg-slate-50">
                  <LogoutIcon className="h-4 w-4 text-muted-foreground" />
                  {isExpanded && <span className="ml-2 text-sm">{item.label}</span>}
                </Button>;
          return isExpanded ? logoutButton : <TooltipProvider key="logout">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {logoutButton}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>;
        }

        // Dropdown Menu (for Jobs and other dropdowns)
        if (item.type === 'dropdown' && item.items) {
          const DropdownIcon = item.icon;
          return <Collapsible key={item.label}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className={cn("w-full justify-between h-10", isExpanded ? "px-2" : "px-2 justify-center")}>
                      <div className="flex items-center">
                        <DropdownIcon className="h-4 w-4 text-muted-foreground" />
                        {isExpanded && <span className="ml-2 text-sm">{item.label}</span>}
                      </div>
                      {isExpanded && <ChevronDown className="h-3 w-3" />}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    {isExpanded && item.items && item.items.map(subItem => {
                const isSubActive = location.pathname === subItem.path;
                const SubIcon = subItem.icon;
                return <Button key={subItem.path} asChild variant={isSubActive ? "secondary" : "ghost"} size="sm" className={cn("w-full justify-start h-9 pl-8", isSubActive && "bg-white border border-foreground/10")}>
                          <Link to={subItem.path}>
                            <SubIcon className={cn("h-4 w-4", isSubActive ? "text-primary" : "text-muted-foreground")} />
                            <span className="ml-2 text-sm">{subItem.label}</span>
                          </Link>
                        </Button>;
              })}
                  </CollapsibleContent>
                </Collapsible>;
        }
        return null;
      })}

        {/* Show team links only when on the Teams page */}
        {isTeamsPage && isExpanded && teamLinks.map(team => {
        const isActive = location.pathname === team.path;
        const TeamIcon = team.icon;
        return <Button key={team.path} asChild variant={isActive ? "secondary" : "ghost"} size="sm" className={cn("w-full justify-start h-9 pl-4", isExpanded ? "px-2" : "px-2 justify-center", isActive && "bg-white border border-foreground/10")}>
              <Link to={team.path}>
                <TeamIcon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground", team.color === "red" && "text-red-500", team.color === "blue" && "text-blue-500", team.color === "green" && "text-green-500")} />
                <span className={cn("ml-2 text-sm", team.color === "red" && "text-red-500", team.color === "blue" && "text-blue-500", team.color === "green" && "text-green-500")}>
                  {team.label}
                </span>
              </Link>
            </Button>;
      })}
        </div>)}
    </nav>;
}