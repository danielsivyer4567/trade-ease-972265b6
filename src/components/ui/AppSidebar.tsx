
import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from './sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  SidebarHeader, 
  SidebarNavLinks, 
  SidebarTeamSection,
  MobileSidebarToggle 
} from './sidebar';
import { SIDEBAR_CONSTANTS } from './sidebar/constants';

export function AppSidebar() {
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
  
  const {
    state,
    isMobile: isMobileContext
  } = useSidebar();
  
  const isMobileDevice = useIsMobile();

  // Simplified effect to avoid potential async issues
  React.useEffect(() => {
    console.log('Sidebar State:', state, isMobileContext, isMobileDevice);
  }, [state, isMobileContext, isMobileDevice]);

  return (
    <>
      <MobileSidebarToggle />

      <div data-state={state} className={cn(
        "peer z-30",
        isMobileDevice && "transition-transform duration-300",
        isMobileDevice && state === "collapsed" && "-translate-x-full"
      )}>
        <div className="flex flex-col h-full bg-slate-200">
          <SidebarHeader 
            logoSrc="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png" 
            title="Trade Ease" 
          />

          <SidebarNavLinks />
          
          <SidebarTeamSection teams={teams} />
        </div>
      </div>
    </>
  );
}
