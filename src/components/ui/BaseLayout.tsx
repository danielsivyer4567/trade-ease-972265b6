
import React from 'react';
import { cn } from '@/lib/utils';
import { AppSidebar } from './AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { MainContent } from './MainContent';
import { SidebarProvider } from './sidebar/SidebarProvider';

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
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);
  
  // Handle sidebar state changes
  React.useEffect(() => {
    // Automatically collapse sidebar on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <SidebarProvider>
      <div className={cn(
        "relative min-h-screen w-full",
        className
      )}>
        {/* Sidebar */}
        <AppSidebar 
          isExpanded={sidebarOpen}
          onToggle={toggleSidebar}
          className="fixed top-0 left-0 h-full"
        />

        {/* Main Content */}
        <main className={cn(
          "min-h-screen w-full bg-[#EFF2F5]",
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "pl-[240px]" : "pl-[64px]"
        )}>
          <MainContent 
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
            showQuickTabs={showQuickTabs}
          >
            {children}
          </MainContent>
        </main>
      </div>
    </SidebarProvider>
  );
}
