import React from 'react';
import { cn } from '@/lib/utils';
import { AppSidebar } from './AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { MainContent } from './MainContent';
import { SidebarProvider } from './sidebar/SidebarProvider';
<<<<<<< HEAD
import GeminiVoiceAssistant from "@/components/gemini/GeminiVoiceAssistant";
=======
import GeminiListen from "@/components/gemini/GeminiListen";
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
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
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
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

  // Persist dark mode settings
  React.useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <SidebarProvider>
      <SidebarThemeProvider defaultTheme="default">
        <div className={cn(
          "relative flex min-h-screen h-screen w-full",
          className,
          isDarkMode ? "dark" : ""
        )}>
          {/* Sidebar - conditionally render based on the prop */}
          {!useNewSidebar ? (
            <AppSidebar 
              isExpanded={sidebarOpen}
              onToggle={toggleSidebar}
              className="fixed top-0 left-0 h-full z-40"
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          ) : (
            /* You can uncomment this when ready to use the new sidebar */
            /* <Sidebar /> */
            <AppSidebar 
              isExpanded={sidebarOpen}
              onToggle={toggleSidebar}
              className="fixed top-0 left-0 h-full z-40"
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          )}

          {/* Main Content */}
          <main className={cn(
            "min-h-screen h-screen w-full bg-[#f0f4fa] dark:bg-slate-900 flex flex-col",
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
<<<<<<< HEAD
          <GeminiVoiceAssistant />
=======
          <GeminiListen />
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
          
          {/* Tab Navigator for direct/indirect tab navigation */}
          <TabNavigator />
        </div>
      </SidebarThemeProvider>
    </SidebarProvider>
  );
}
