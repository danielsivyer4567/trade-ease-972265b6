import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '../../button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../tooltip";
import { cn } from '@/lib/utils';
import { iconVariants, navItemVariants } from '../theme/sidebarTheme';
import { useSidebarTheme } from '../theme/SidebarThemeContext';

interface LogoutButtonProps {
  isExpanded: boolean;
  onLogout: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ isExpanded, onLogout }) => {
  const { theme } = useSidebarTheme();
  
  const logoutButton = (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onLogout} 
      className={cn(
        "py-[8px] px-2 text-left rounded-lg w-full",
        navItemVariants({ theme })
      )}
    >
      <LogOut className={cn(iconVariants({ theme }), "h-4 w-4")} />
      {isExpanded && <span className="ml-2 text-xs overflow-hidden text-ellipsis">Logout</span>}
    </Button>
  );
  
  return isExpanded ? (
    logoutButton
  ) : (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {logoutButton}
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center">
          Logout
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
