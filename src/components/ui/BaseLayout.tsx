
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AppSidebar } from './AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { MainContent } from './MainContent';
import { SIDEBAR_CONSTANTS } from './sidebar/constants';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
  showQuickTabs?: boolean;
}

export function BaseLayout({
  children,
  className,
  showQuickTabs = false
}: BaseLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Handle sidebar state changes
  useEffect(() => {
    // Automatically collapse sidebar on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100">
      {/* Sidebar - only render one instance */}
      <AppSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <MainContent 
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
        showQuickTabs={showQuickTabs}
        className={className}
      >
        {children}
      </MainContent>
    </div>
  );
}
