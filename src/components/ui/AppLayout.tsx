
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({
  children,
  className
}: AppLayoutProps) {
  // Save active tab states when component unmounts
  useEffect(() => {
    // Save all tab states when the window unloads
    const saveTabStates = () => {
      // Find all elements with data-state="active" that are tab triggers
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
    
    // Add event listener for when the page unloads
    window.addEventListener('beforeunload', saveTabStates);
    
    // Restore tab states when component mounts
    const restoreTabStates = () => {
      try {
        const savedStates = localStorage.getItem('tabStates');
        
        if (savedStates) {
          const tabStates = JSON.parse(savedStates);
          
          // Apply saved states after a short delay to ensure DOM is ready
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

  return (
    <SidebarProvider defaultOpen={!window.matchMedia('(max-width: 1024px)').matches}>
      <div className="min-h-screen min-w-full flex bg-transparent">
        <AppSidebar />
        <main className={cn(
          "flex-1 overflow-auto transition-[margin] duration-300 ease-in-out",
          "p-2 md:p-4 lg:p-6", // Smaller padding on mobile
          "peer-data-[state=expanded]:ml-[240px] peer-data-[state=collapsed]:ml-[60px]", 
          className
        )}>
          <div className="relative mx-auto max-w-7xl glass-card p-3 md:p-6 rounded-lg border-2 border-white/50 shadow-2xl">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
