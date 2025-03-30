
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { QuickTabs } from "./QuickTabs";
import { SIDEBAR_CONSTANTS } from "./sidebar/constants";
import { ScrollArea } from "./scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

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
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                <LogOut className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content Area - removed max-width and padding */}
      <ScrollArea className="flex-1 w-full">
        <div className="relative w-full">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}
