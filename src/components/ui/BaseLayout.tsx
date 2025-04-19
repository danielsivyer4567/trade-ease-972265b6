import React from 'react';
import { cn } from '@/lib/utils';
import { AppSidebar } from './AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { MainContent } from './MainContent';
import { SidebarProvider } from './sidebar/SidebarProvider';
import GeminiListen from "@/components/gemini/GeminiListen";
import { SidebarThemeProvider } from './sidebar/theme/SidebarThemeContext';
import { TabNavigator } from './TabNavigator';
// Optionally import the new sidebar
// import { Sidebar } from '@/components/navigation/Sidebar';

interface BaseLayoutProps {
  children: React.ReactNode;
  className?: string;
  showQuickTabs?: boolean;
  // Add prop to control which sidebar to use
  useNewSidebar?: boolean;
}

export function BaseLayout({
  children,
  className,
  showQuickTabs = false,
  useNewSidebar = false // Default to using the original sidebar
}: BaseLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);
  
  // Handle sidebar state changes
  React.useEffect(() => {
    // Automatically collapse sidebar on mobile
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      // Ensure sidebar is open on desktop
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <SidebarProvider>
      <SidebarThemeProvider defaultTheme="default">
        <div className={cn(
          "relative flex min-h-screen w-full",
          className
        )}>
          {/* Sidebar - conditionally render based on the prop */}
          {!useNewSidebar ? (
            <AppSidebar 
              isExpanded={sidebarOpen}
              onToggle={toggleSidebar}
              className="fixed top-0 left-0 h-full z-40"
            />
          ) : (
            /* You can uncomment this when ready to use the new sidebar */
            /* <Sidebar /> */
            <AppSidebar 
              isExpanded={sidebarOpen}
              onToggle={toggleSidebar}
              className="fixed top-0 left-0 h-full z-40"
            />
          )}

          {/* Main Content */}
          <main className={cn(
            "min-h-screen w-full bg-[#EFF2F5]",
            "transition-all duration-300 ease-in-out",
            sidebarOpen ? "md:pl-[240px]" : "md:pl-[64px]",
            isMobile ? "pl-0" : ""
          )}>
            <MainContent 
              sidebarOpen={sidebarOpen}
              isMobile={isMobile}
              showQuickTabs={showQuickTabs}
            >
              {children}
            </MainContent>
          </main>
          
          {/* Gemini Listen Feature */}
          <GeminiListen />
          
          {/* Tab Navigator for direct/indirect tab navigation */}
          <TabNavigator />
        </div>
      </SidebarThemeProvider>
    </SidebarProvider>
  );
}
