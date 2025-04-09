
import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '../../button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../tooltip";

interface LogoutButtonProps {
  isExpanded: boolean;
  onLogout: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ isExpanded, onLogout }) => {
  const logoutButton = (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onLogout} 
      className="py-[15px] px-2 text-left text-gray-950 rounded-lg w-full"
    >
      <LogOut className="h-4 w-4 text-muted-foreground" />
      {isExpanded && <span className="ml-2 text-sm overflow-hidden text-ellipsis">Logout</span>}
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
