
import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '../sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export type Team = {
  name: string;
  color: string;
  path: string;
};

interface SidebarTeamSectionProps {
  teams: Team[];
}

export function SidebarTeamSection({ teams }: SidebarTeamSectionProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const isMobileDevice = useIsMobile();

  if (isCollapsed) {
    return null;
  }

  return (
    <div className={cn("pt-8", isCollapsed && "hidden lg:hidden")}>
      <div className="mb-2 text-sm font-bold text-black px-2">
        Teams view
      </div>
      {teams.map(team => (
        <Link 
          key={team.name} 
          to={team.path} 
          className={cn(
            "flex items-center gap-2 p-2 rounded-lg text-sm",
            `hover:bg-${team.color}-50 text-${team.color}-600 hover:text-${team.color}-700`,
            isMobileDevice && "p-3 min-h-[48px]"
          )}
        >
          <Hammer className="w-4 h-4 flex-shrink-0" />
          <span className={cn("transition-opacity duration-200", isCollapsed && "hidden lg:hidden")}>
            {team.name}
          </span>
        </Link>
      ))}
      <Link 
        to="/team-new" 
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-700 text-sm mt-1", 
          isCollapsed && "hidden lg:hidden", 
          isMobileDevice && "p-3 min-h-[48px]"
        )}
      >
        <Plus className="w-4 h-4 flex-shrink-0" />
        <span>Add Team</span>
      </Link>
    </div>
  );
}
