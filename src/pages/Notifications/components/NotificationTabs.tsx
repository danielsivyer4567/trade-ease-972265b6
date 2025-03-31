
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Notification } from "../types";
import { NotificationsTabContent } from "./NotificationsTabContent";
import { cn } from "@/lib/utils";

interface NotificationTabsProps {
  activeNotifications: Notification[];
  sortedLaterNotifications: Notification[];
  completedNotifications: Notification[];
  incompleteNotifications: Notification[];
  handleNotificationClick: (id: number) => void;
  handleComplete: (id: number) => void;
  handleSortLater: (id: number) => void;
  isLoading: boolean;
}

export const NotificationTabs = ({
  activeNotifications,
  sortedLaterNotifications,
  completedNotifications,
  incompleteNotifications,
  handleNotificationClick,
  handleComplete,
  handleSortLater,
  isLoading
}: NotificationTabsProps) => {
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

  return (
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
  );
};

// Fix missing import
import { Badge } from "@/components/ui/badge";
