import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";
import { QuickTabs } from "./QuickTabs";
import { SIDEBAR_CONSTANTS } from "./sidebar/constants";
import { ScrollArea } from "./scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationsContainer } from "@/components/notifications/NotificationsContainer";
import { TabBar } from "./TabBar";

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
  showQuickTabs = false,
}: MainContentProps) {
  const navigate = useNavigate();
  
  // Safely get signOut from auth context with fallback
  let signOut = () => {
    console.log('Auth context not available');
    navigate('/auth');
  };
  
  try {
    const auth = useAuth();
    signOut = auth.signOut;
  } catch (error) {
    console.error('Auth context not available:', error);
  }

  return (
    <div
      className={cn(
        "relative flex flex-col flex-1 overflow-x-hidden",
        sidebarOpen && "transition-all duration-300 ease-in-out",
        className
      )}
      style={
        {
          "--sidebar-width-value": isMobile
            ? "0px"
            : sidebarOpen
            ? SIDEBAR_CONSTANTS.SIDEBAR_WIDTH
            : "0px",
        } as React.CSSProperties
      }
    >
      {/* Header Section */}
      <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[#B8C5D5] bg-[#E2E8F0] px-4 md:px-6">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2 w-full">
            <QuickTabs />
          </div>
          <div className="flex items-center space-x-2">
            <div className="border-2 border-black p-1">
              <NotificationsContainer />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Bar - Browser-like tabs */}
      <TabBar />

      {/* Main Content Area - Tab content */}
      <ScrollArea className="flex-1 w-full">
        <div className="relative w-full">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}
