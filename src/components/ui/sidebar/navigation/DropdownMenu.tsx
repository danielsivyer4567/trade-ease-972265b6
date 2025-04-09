
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../../button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../collapsible";

interface DropdownItemType {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface DropdownMenuProps {
  label: string;
  icon: LucideIcon;
  items: DropdownItemType[];
  isExpanded: boolean;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label,
  icon: DropdownIcon,
  items,
  isExpanded
}) => {
  const location = useLocation();
  
  if (!isExpanded) {
    return null; // Don't render dropdown when sidebar is collapsed
  }
  
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-between h-10 px-2"
        >
          <div className="flex items-center">
            <DropdownIcon className="h-4 w-4 text-muted-foreground" />
            <span className="ml-2 text-sm overflow-hidden text-ellipsis">{label}</span>
          </div>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        {items.map(subItem => {
          const isSubActive = location.pathname === subItem.path;
          const SubIcon = subItem.icon;
          
          return (
            <Button 
              key={subItem.path} 
              asChild 
              variant={isSubActive ? "secondary" : "ghost"} 
              size="sm" 
              className={cn(
                "w-full justify-start h-9 pl-8", 
                isSubActive && "bg-white border border-foreground/10"
              )}
            >
              <Link to={subItem.path}>
                <SubIcon className={cn("h-4 w-4", isSubActive ? "text-primary" : "text-muted-foreground")} />
                <span className="ml-2 text-sm font-medium overflow-hidden text-ellipsis">{subItem.label}</span>
              </Link>
            </Button>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
};
