
import React from 'react';
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
