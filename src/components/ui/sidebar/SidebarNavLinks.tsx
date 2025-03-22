import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, Users, FileText, Settings, Calendar,
  Network, Share, Bot, Mail, MessageSquare, Link as LinkIcon,
  Database, Plus, BarChart, ListTodo, Bell, GitBranch, Gauge, Calculator,
  LucideIcon, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarProvider';
import { Button } from '../button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";
import { ScrollArea } from '../scroll-area';
import { navigationGroups } from './constants';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../collapsible';

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

export function SidebarNavLinks({ isExpanded = true }: SidebarNavLinksProps) {
  const location = useLocation();

  return (
    <nav className="grid gap-1 px-2 py-2">
      {navigationGroups.map((group, index) => (
        <div key={index} className="grid gap-0.5">
          {/* Group Label */}
          {isExpanded && group.label && (
            <h4 className="mb-1 px-2 text-xs font-semibold text-muted-foreground">
              {group.label}
            </h4>
          )}

          {/* Regular Links */}
          {group.items.map((item) => {
            if (item.type === 'link') {
              const isActive = location.pathname === item.path;
              const LinkIcon = item.icon;

              const linkButton = (
                <Button
                  key={item.path}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start h-[0px]",
                    isExpanded ? "px-2" : "px-2 justify-center",
                    isActive && "bg-white border border-foreground/10"
                  )}
                >
                  <Link to={item.path}>
                    <LinkIcon className={cn(
                      "h-4 w-4",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} />
                    {isExpanded && (
                      <span className="ml-2 text-sm">{item.label}</span>
                    )}
                  </Link>
                </Button>
              );

              return isExpanded ? (
                linkButton
              ) : (
                <Tooltip key={item.path} delayDuration={0}>
                  <TooltipTrigger asChild>
                    {linkButton}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-normal">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            // Dropdown Menu (for Teams)
            if (item.type === 'dropdown') {
              return (
                <Collapsible key={item.label}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-full justify-between h-10",
                        isExpanded ? "px-2" : "px-2 justify-center"
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                        {isExpanded && (
                          <span className="ml-2 text-sm">{item.label}</span>
                        )}
                      </div>
                      {isExpanded && <ChevronDown className="h-3 w-3" />}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="pl-4 mt-0.5">
                    {item.items.map((subItem) => {
                      const isActive = location.pathname === subItem.path;
                      return (
                        <Button
                          key={subItem.path}
                          asChild
                          variant={isActive ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start h-10 mb-0.5"
                        >
                          <Link to={subItem.path}>
                            <subItem.icon className={cn(
                              "h-4 w-4",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )} />
                            <span className="ml-2 text-sm">{subItem.label}</span>
                          </Link>
                        </Button>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            }
          })}
        </div>
      ))}
    </nav>
  );
}
