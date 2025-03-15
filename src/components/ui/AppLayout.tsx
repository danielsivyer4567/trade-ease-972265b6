
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { QuickTabs } from './QuickTabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { SIDEBAR_CONSTANTS } from './sidebar/constants';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({
  children,
  className
}: AppLayoutProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();
  const isMainDashboard = location.pathname === '/' || location.pathname === '/index';

  // Mobile detection logging
  React.useEffect(() => {
    console.log('📱 Mobile Detection:', { isMobile });
  }, [isMobile]);

  useEffect(() => {
    const saveTabStates = () => {
      const activeTabs = document.querySelectorAll('[role="tab"][data-state="active"]');
      const tabStates: Record<string, string> = {};
      activeTabs.forEach(tab => {
        const tabId = tab.getAttribute('data-value');
        const tabGroupId = (tab.closest('[role="tabslist"]') as HTMLElement)?.id || 'default-tabs';
        if (tabId) {
          tabStates[tabGroupId] = tabId;
        }
      });
      localStorage.setItem('tabStates', JSON.stringify(tabStates));
    };

    window.addEventListener('beforeunload', saveTabStates);

    const restoreTabStates = () => {
      try {
        const savedStates = localStorage.getItem('tabStates');
        if (savedStates) {
          const tabStates = JSON.parse(savedStates);

          setTimeout(() => {
            Object.entries(tabStates).forEach(([groupId, tabId]) => {
              const tabsList = document.getElementById(groupId);
              if (tabsList) {
                const tabToActivate = tabsList.querySelector(`[data-value="${tabId}"]`) as HTMLElement;
                if (tabToActivate) {
                  tabToActivate.click();
                }
              }
            });
          }, 100);
        }
      } catch (error) {
        console.error('Error restoring tab states:', error);
      }
    };
    restoreTabStates();
    return () => {
      window.removeEventListener('beforeunload', saveTabStates);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error("Failed to log out");
    }
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen min-w-full flex bg-transparent">
        <AppSidebar />
        <main className={cn(
          "flex-1 overflow-auto transition-all duration-300 ease-in-out", 
          isMobile ? "p-2 pt-16" : "p-3 md:p-4 lg:p-6",
          !isMobile && "ml-[var(--sidebar-width-value)]",
          className
        )}
        style={{
          '--sidebar-width-value': isMobile 
            ? '0px' 
            : (location.pathname.includes('/team') 
                ? SIDEBAR_CONSTANTS.SIDEBAR_WIDTH 
                : SIDEBAR_CONSTANTS.SIDEBAR_WIDTH)
        } as React.CSSProperties}
        >
          <div className="relative w-full h-full glass-card p-2 md:p-4 lg:p-6 border-2 border-white/50 shadow-2xl bg-slate-200 rounded-xl">
            <div className="absolute top-3 right-3 z-10">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout} 
                className="flex items-center gap-2 bg-slate-300 hover:bg-slate-400 text-gray-700 my-0 mx-[4px] py-[4px] px-[15px]"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
            
            {isMainDashboard && <QuickTabs />}
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
