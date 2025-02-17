
import React from 'react';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './AppSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AppLayout({ children, className }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen min-w-full flex bg-background">
        <AppSidebar />
        <main className={cn("flex-1 p-6 overflow-auto ml-40", className)}>
          <div className="relative mx-auto max-w-7xl">
            <div className="flex items-center gap-2 absolute top-0 left-0">
              <img 
                src="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png"
                alt="Trade Ease Logo"
                className="w-12 h-12 md:w-16 md:h-16"
              />
              <span className="text-lg md:text-2xl font-bold text-gray-900">Trade Ease</span>
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
