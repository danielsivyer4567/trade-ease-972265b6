import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Mail,
  Globe,
  Bell,
  Clock,
  CheckCircle2,
  Loader2,
  Maximize2,
  Minimize2,
  XCircle,
  Settings,
  X,
} from "lucide-react";
import { NotificationsTabContent } from "./components/NotificationsTabContent";
import { EmailSettingsTab } from "./components/EmailSettingsTab";
import { WebEnquiryTab } from "./components/WebEnquiryTab";
import { useNotifications } from "./hooks/useNotifications";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@radix-ui/react-context-menu";


export default function Notifications() {
  const [isFullWidth, setIsFullWidth] = useState(() => {
    // Initialize from localStorage, default to false if not set
    const saved = localStorage.getItem("notifications-full-width");
    return saved ? JSON.parse(saved) : false;
  });

  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const {
    activeNotifications,
    sortedLaterNotifications,
    completedNotifications,
    incompleteNotifications,
    handleNotificationClick,
    handleComplete,
    handleSortLater,
    // Email settings
    forwardingEmail,
    setForwardingEmail,
    emailNotificationsEnabled,
    setEmailNotificationsEnabled,
    saveEmailSettings,
    // Web enquiry settings
    webEnquiryNotifications,
    setWebEnquiryNotifications,
    enquiryEmail,
    setEnquiryEmail,
    saveWebEnquirySettings,
    // Loading state
    isLoading,
  } = useNotifications();

  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isWebEnquiryDialogOpen, setIsWebEnquiryDialogOpen] = useState(false);

  const renderBadge = (
    count: number,
    variant?: "default" | "yellow" | "green" | "red"
  ) => {
    if (count === 0) return null;

    const variants = {
      default: "bg-blue-50 text-blue-700 border border-blue-500 ",
      yellow: "bg-amber-50 text-amber-700 border border-amber-500",
      green: "bg-emerald-50 text-emerald-700 border border-emerald-500",
      red: "bg-red-50 text-red-700 border border-red-500",
    };

    return (
      <Badge
        variant="secondary"
        className={cn(
          "ml-auto font-medium text-xs",
          variants[variant || "default"]
        )}
      >
        {count}
      </Badge>
    );
  };

  const handleLayoutToggle = () => {
    setIsButtonPressed(true);
    setIsFullWidth(!isFullWidth);
    setTimeout(() => setIsButtonPressed(false), 200);
  };

  return (
    <AppLayout>
      <div
        className={cn(
          "h-[calc(100vh-106px)] flex flex-col mx-auto transition-all transform duration-500 ease-in-out",
          isFullWidth
            ? "w-full scale-100 origin-top"
            : "max-w-[1200px] scale-[0.99] hover:scale-100"
        )}
      >
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
                    <Dialog.Root open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
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
                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
                        <Dialog.Content className="fixed left-[50%] top-[50%] z-[51] grid w-full max-w-[425px] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg">
                          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                              Email Settings
                            </Dialog.Title>
                            <Dialog.Description className="text-sm text-muted-foreground">
                              Configure your email notification preferences
                            </Dialog.Description>
                          </div>
                          <div className="py-4">
                            <EmailSettingsTab
                              emailNotificationsEnabled={emailNotificationsEnabled}
                              setEmailNotificationsEnabled={setEmailNotificationsEnabled}
                              forwardingEmail={forwardingEmail}
                              setForwardingEmail={setForwardingEmail}
                              saveEmailSettings={saveEmailSettings}
                            />
                          </div>
                          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                            <Button type="submit" onClick={saveEmailSettings}>
                              Save changes
                            </Button>
                          </div>
                          <Dialog.Close asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Close</span>
                            </Button>
                          </Dialog.Close>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
                    <Dialog.Root open={isWebEnquiryDialogOpen} onOpenChange={setIsWebEnquiryDialogOpen}>
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
                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
                        <Dialog.Content className="fixed left-[50%] top-[50%] z-[51] grid w-full max-w-[425px] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg">
                          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                              Web Enquiry Settings
                            </Dialog.Title>
                            <Dialog.Description className="text-sm text-muted-foreground">
                              Configure your web enquiry notification preferences
                            </Dialog.Description>
                          </div>
                          <div className="py-4">
                            <WebEnquiryTab
                              webEnquiryNotifications={webEnquiryNotifications}
                              setWebEnquiryNotifications={setWebEnquiryNotifications}
                              enquiryEmail={enquiryEmail}
                              setEnquiryEmail={setEnquiryEmail}
                              saveWebEnquirySettings={saveWebEnquirySettings}
                            />
                          </div>
                          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                            <Button type="submit" onClick={saveWebEnquirySettings}>
                              Save changes
                            </Button>
                          </div>
                          <Dialog.Close asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Close</span>
                            </Button>
                          </Dialog.Close>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
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

        <div className="flex-1 px-6 pb-6 min-h-0">
          <Card
            className={cn(
              "h-full flex flex-col p-6 relative bg-white transition-all duration-500 ease-in-out",
              "hover:shadow-lg hover:border-gray-300",
              isFullWidth ? "shadow-md" : "shadow-sm hover:shadow",
              isButtonPressed && "scale-[0.99]"
            )}
          >
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            <Tabs
              defaultValue="active"
              className="flex-1 flex flex-col min-h-0"
            >
              <TabsList
                className={cn(
                  "w-full h-auto p-1 mb-6 gap-2 bg-gray-50/80 flex-shrink-0",
                  "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-row lg:justify-start"
                )}
              >
                <TabsTrigger
                  value="active"
                  className={cn(
                    "flex items-center gap-2 flex-1 lg:flex-initial lg:min-w-[120px]",
                    "py-2.5 px-3 h-auto transition-all duration-200",
                    "data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700",
                    "data-[state=active]:border data-[state=active]:border-blue-200",
                    "data-[state=inactive]:hover:bg-gray-100/80",
                    "rounded-md"
                  )}
                >
                  <Bell className="h-4 w-4 data-[state=active]:text-blue-500 text-gray-500" />
                  <span className="text-sm font-medium">Active</span>
                  {renderBadge(activeNotifications.length)}
                </TabsTrigger>

                <TabsTrigger
                  value="sort-later"
                  className={cn(
                    "flex items-center gap-2 flex-1 lg:flex-initial lg:min-w-[120px]",
                    "py-2.5 px-3 h-auto transition-all duration-200",
                    "data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700",
                    "data-[state=active]:border data-[state=active]:border-amber-200",
                    "data-[state=inactive]:hover:bg-gray-100/80",
                    "rounded-md"
                  )}
                >
                  <Clock className="h-4 w-4 data-[state=active]:text-amber-500 text-gray-500" />
                  <span className="text-sm font-medium">Sort Later</span>
                  {renderBadge(sortedLaterNotifications.length, "yellow")}
                </TabsTrigger>

                <TabsTrigger
                  value="completed"
                  className={cn(
                    "flex items-center gap-2 flex-1 lg:flex-initial lg:min-w-[120px]",
                    "py-2.5 px-3 h-auto transition-all duration-200",
                    "data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700",
                    "data-[state=active]:border data-[state=active]:border-emerald-200",
                    "data-[state=inactive]:hover:bg-gray-100/80",
                    "rounded-md"
                  )}
                >
                  <CheckCircle2 className="h-4 w-4 data-[state=active]:text-emerald-500 text-gray-500" />
                  <span className="text-sm font-medium">Completed</span>
                  {renderBadge(completedNotifications.length, "green")}
                </TabsTrigger>

                <TabsTrigger
                  value="incomplete"
                  className={cn(
                    "flex items-center gap-2 flex-1 lg:flex-initial lg:min-w-[120px]",
                    "py-2.5 px-3 h-auto transition-all duration-200",
                    "data-[state=active]:bg-red-50 data-[state=active]:text-red-700",
                    "data-[state=active]:border data-[state=active]:border-red-200",
                    "data-[state=inactive]:hover:bg-gray-100/80",
                    "rounded-md"
                  )}
                >
                  <XCircle className="h-4 w-4 data-[state=active]:text-red-500 text-gray-500" />
                  <span className="text-sm font-medium">Incomplete</span>
                  {renderBadge(incompleteNotifications?.length || 0, "red")}
                </TabsTrigger>
              </TabsList>

              <div className="relative flex-1 min-h-0">
                <TabsContent
                  value="active"
                  className="absolute inset-0 h-full overflow-auto"
                >
                  <NotificationsTabContent
                    notifications={activeNotifications}
                    onComplete={handleComplete}
                    onSortLater={handleSortLater}
                    onNotificationClick={handleNotificationClick}
                    isCompletedTab={false}
                  />
                </TabsContent>

                <TabsContent
                  value="sort-later"
                  className="absolute inset-0 h-full overflow-auto"
                >
                  <NotificationsTabContent
                    notifications={sortedLaterNotifications}
                    onComplete={handleComplete}
                    onSortLater={handleSortLater}
                    onNotificationClick={handleNotificationClick}
                    isCompletedTab={false}
                  />
                </TabsContent>

                <TabsContent
                  value="completed"
                  className="absolute inset-0 h-full overflow-auto"
                >
                  <NotificationsTabContent
                    notifications={completedNotifications}
                    onComplete={handleComplete}
                    onSortLater={handleSortLater}
                    onNotificationClick={handleNotificationClick}
                    isCompletedTab={true}
                  />
                </TabsContent>

                <TabsContent
                  value="incomplete"
                  className="absolute inset-0 h-full overflow-auto"
                >
                  <NotificationsTabContent
                    notifications={incompleteNotifications || []}
                    onComplete={handleComplete}
                    onSortLater={handleSortLater}
                    onNotificationClick={handleNotificationClick}
                    isCompletedTab={false}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
