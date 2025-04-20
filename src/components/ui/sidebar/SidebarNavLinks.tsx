import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from './SidebarProvider';
import { ScrollArea } from '../scroll-area';
import { navigationGroups, teamLinks } from './constants';
import { NavigationGroup as SidebarNavigationGroup } from './constants';
import { useAuth } from '@/contexts/AuthContext';
import { NavigationGroup as NavGroup } from './navigation/NavigationGroup';
import { TeamLinks } from './navigation/TeamLinks';

interface SidebarNavLinksProps {
  isExpanded?: boolean;
}

export function SidebarNavLinks({
  isExpanded = true
}: SidebarNavLinksProps) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Safely use Auth context with a fallback
  let signOut = () => {
    console.log('Auth context not available');
    navigate('/auth');
  };
  
  try {
    const auth = useAuth();
    signOut = auth.signOut;
  } catch (error) {
    console.error('Auth context not available:', error);
  }
  
  const isTeamsPage = location.pathname === "/teams";
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="grid gap-1 px-2 py-2 w-full">
      {navigationGroups.map((group: SidebarNavigationGroup, index) => (
        <NavGroup
          key={`nav-group-${index}`}
          label={group.label || undefined}
          items={group.items}
          isExpanded={isExpanded}
          onLogout={handleLogout}
        />
      ))}
      
      {/* Show team links only when on the Teams page */}
      {isTeamsPage && (
        <TeamLinks
          teamLinks={teamLinks}
          isExpanded={isExpanded}
        />
      )}
    </div>
  );
}
