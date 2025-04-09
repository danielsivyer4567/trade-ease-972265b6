
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../../button';

interface TeamLinkType {
  label: string;
  path: string;
  icon: LucideIcon;
  color?: string;
}

interface TeamLinksProps {
  teamLinks: TeamLinkType[];
  isExpanded: boolean;
}

export const TeamLinks: React.FC<TeamLinksProps> = ({
  teamLinks,
  isExpanded
}) => {
  const location = useLocation();
  
  if (!isExpanded || !teamLinks.length) {
    return null;
  }
  
  return (
    <>
      {teamLinks.map(team => {
        const isActive = location.pathname === team.path;
        const TeamIcon = team.icon;
        
        return (
          <Button 
            key={team.path} 
            asChild 
            variant={isActive ? "secondary" : "ghost"} 
            size="sm" 
            className={cn(
              "w-full justify-start h-9 pl-4", 
              "px-2", 
              isActive && "bg-white border border-foreground/10"
            )}
          >
            <Link to={team.path}>
              <TeamIcon className={cn(
                "h-4 w-4", 
                isActive ? "text-primary" : "text-muted-foreground",
                team.color === "red" && "text-red-500",
                team.color === "blue" && "text-blue-500",
                team.color === "green" && "text-green-500"
              )} />
              <span className={cn(
                "ml-2 text-sm font-medium overflow-hidden text-ellipsis",
                team.color === "red" && "text-red-500",
                team.color === "blue" && "text-blue-500",
                team.color === "green" && "text-green-500"
              )}>
                {team.label}
              </span>
            </Link>
          </Button>
        );
      })}
    </>
  );
};
