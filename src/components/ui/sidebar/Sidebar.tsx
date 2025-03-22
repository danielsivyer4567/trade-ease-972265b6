import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarProvider";
import { Sheet, SheetContent } from "../sheet";
import { ScrollArea } from "../scroll-area";
import { SIDEBAR_CONSTANTS } from "./constants";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className, children }: SidebarProps) {
  const { isMobile, openMobile, setOpenMobile, state } = useSidebar();

  // Mobile sidebar using Sheet component
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-[300px] p-0 ">
          <ScrollArea className="h-full">
            <div className="space-y-4 py-4">
              {children}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  return (
    <div
      data-state={state}
      className={cn(
        "relative hidden h-screen border-r bg-background md:flex md:flex-col ",
        state === "expanded" ? "w-[240px]" : "w-[60px]",
        "transition-all duration-300 ease-in-out",
        className
      )}
      style={{
        "--sidebar-width": SIDEBAR_CONSTANTS.SIDEBAR_WIDTH,
        "--sidebar-width-icon": SIDEBAR_CONSTANTS.SIDEBAR_WIDTH_ICON,
      } as React.CSSProperties}
    >
      <ScrollArea className="flex-1">
        <div className="">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}
