
import React from "react";
import { Settings, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";

interface NotificationHeaderProps {
  setIsEmailDialogOpen: (open: boolean) => void;
  setIsWebEnquiryDialogOpen: (open: boolean) => void;
  isFullWidth: boolean;
  handleLayoutToggle: () => void;
  isButtonPressed: boolean;
}

export const NotificationHeader = ({
  setIsEmailDialogOpen,
  setIsWebEnquiryDialogOpen,
  isFullWidth,
  handleLayoutToggle,
  isButtonPressed
}: NotificationHeaderProps) => {
  return (
    <div className="flex-shrink-0 p-6 pb-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Manage your notifications and communication preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu.Root>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu.Trigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 transition-all duration-300 ease-in-out hover:bg-gray-100/80"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenu.Trigger>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                className="w-48 rounded-md border bg-white p-1 shadow-md animate-in fade-in-80 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1"
              >
                <Dialog.Trigger asChild>
                  <DropdownMenu.Item 
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    onSelect={(event) => {
                      event.preventDefault();
                      setIsEmailDialogOpen(true);
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Email Settings</span>
                  </DropdownMenu.Item>
                </Dialog.Trigger>
                <Dialog.Trigger asChild>
                  <DropdownMenu.Item 
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    onSelect={(event) => {
                      event.preventDefault();
                      setIsWebEnquiryDialogOpen(true);
                    }}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    <span>Web Enquiry</span>
                  </DropdownMenu.Item>
                </Dialog.Trigger>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-9 w-9 transition-all duration-300 ease-in-out",
                    "hover:bg-gray-100/80 active:bg-gray-200/80",
                    "relative overflow-hidden",
                    isButtonPressed && "scale-90",
                    isFullWidth ? "rotate-180" : "rotate-0"
                  )}
                  onClick={handleLayoutToggle}
                >
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center transition-transform duration-300",
                      isFullWidth
                        ? "translate-y-full opacity-0"
                        : "translate-y-0 opacity-100"
                    )}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </div>
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center transition-transform duration-300",
                      isFullWidth
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-full opacity-0"
                    )}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullWidth ? "Constrained Width" : "Full Width"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

// Fix missing import
import { Mail, Globe } from "lucide-react";
