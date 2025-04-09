
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../../button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../tooltip";

interface NavItemProps {
  path: string;
  label: string;
  icon: LucideIcon;
  isExpanded: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({
  path,
  label,
  icon: Icon,
  isExpanded
}) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  const linkButton = (
    <Button 
      key={path} 
      asChild 
      variant={isActive ? "secondary" : "ghost"} 
      size="sm" 
      className={cn(
        "w-full justify-start h-9", 
        isExpanded ? "px-2" : "px-2 justify-center", 
        isActive && "bg-white border border-foreground/10"
      )}
    >
      <Link to={path}>
        <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
        {isExpanded && <span className="ml-2 text-sm font-medium overflow-hidden text-ellipsis">{label}</span>}
      </Link>
    </Button>
  );
  
  return isExpanded ? (
    linkButton
  ) : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {linkButton}
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
