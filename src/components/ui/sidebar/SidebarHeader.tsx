
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../button';
import { useSidebar } from '../sidebar';

interface SidebarHeaderProps {
  logoSrc: string;
  title: string;
}

export function SidebarHeader({ logoSrc, title }: SidebarHeaderProps) {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <img src={logoSrc} alt={`${title} Logo`} className="w-8 h-8" />
        <span className={cn(
          "font-semibold text-lg text-gray-900 transition-opacity duration-200", 
          isCollapsed && "opacity-0 lg:hidden"
        )}>
          {title}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="hidden lg:flex h-8 w-8" 
        onClick={toggleSidebar}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  );
}
