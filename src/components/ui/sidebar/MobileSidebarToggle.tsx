
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../button';
import { useSidebar } from '../sidebar';

export function MobileSidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="fixed left-4 top-4 z-40 lg:hidden shadow-sm" 
      onClick={toggleSidebar}
    >
      <Menu className="h-5 w-5 text-gray-700" />
    </Button>
  );
}
