
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { QuickTabs } from './QuickTabs';
import { SIDEBAR_CONSTANTS } from './sidebar/constants';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
  sidebarOpen: boolean;
  isMobile: boolean;
  showQuickTabs?: boolean;
}

export function MainContent({
  children,
  className,
  sidebarOpen,
  isMobile,
  showQuickTabs = false
}: MainContentProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
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
    <main 
      className={cn(
        "flex-1 h-full transition-all duration-300 ease-in-out", 
        isMobile ? "p-2 pt-16" : "p-3 md:p-4 lg:p-6",
        !isMobile && sidebarOpen && "ml-[var(--sidebar-width-value)]",
        className
      )}
      style={{
        '--sidebar-width-value': isMobile 
          ? '0px' 
          : (sidebarOpen ? SIDEBAR_CONSTANTS.SIDEBAR_WIDTH : '0px')
      } as React.CSSProperties}
    >
      <div className="relative w-full min-h-full overflow-visible glass-card p-2 md:p-4 lg:p-6 border border-white/50 shadow-lg bg-slate-200 rounded-xl">
        {/* Logout Button */}
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
        
        {/* Quick Tabs - Only show on main dashboard */}
        {showQuickTabs && <QuickTabs />}
        
        {/* Main Content */}
        <div className="pt-10 min-h-full pb-10">
          {children}
        </div>
      </div>
    </main>
  );
}
