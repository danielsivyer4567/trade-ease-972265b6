
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  SidebarHeader, 
  SidebarNavLinks, 
  SidebarTeamSection
} from './sidebar';
import { SIDEBAR_CONSTANTS } from './sidebar/constants';
import { Menu, X } from 'lucide-react';
import { Button } from './button';

interface AppSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function AppSidebar({
  isOpen,
  toggleSidebar
}: AppSidebarProps) {
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
  
  const isMobileDevice = useIsMobile();

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobileDevice && (
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed left-4 top-4 z-40 lg:hidden shadow-sm" 
          onClick={toggleSidebar}
        >
          {isOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
        </Button>
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed h-screen z-30 transition-all duration-300 ease-in-out",
          isOpen ? `w-[${SIDEBAR_CONSTANTS.SIDEBAR_WIDTH}]` : "w-0",
          isMobileDevice && isOpen && "w-full md:w-auto"
        )}
        style={{
          width: isOpen ? SIDEBAR_CONSTANTS.SIDEBAR_WIDTH : '0px',
          transform: (!isOpen && isMobileDevice) ? 'translateX(-100%)' : 'translateX(0)'
        }}
      >
        <div className={cn(
          "flex flex-col h-full bg-slate-200 border-r border-slate-300",
          !isOpen && "hidden"
        )}>
          <SidebarHeader 
            logoSrc="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png" 
            title="Trade Ease" 
          />

          <SidebarNavLinks />
          
          <SidebarTeamSection teams={teams} />
          
          {/* Close button for mobile */}
          {isMobileDevice && isOpen && (
            <div className="p-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={toggleSidebar}
              >
                <X className="h-4 w-4 mr-2" />
                Close Menu
              </Button>
            </div>
          )}
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isMobileDevice && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
