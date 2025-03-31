
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { NotificationTabs } from "./NotificationTabs";
import { Notification } from "../types";

interface NotificationsContainerProps {
  isFullWidth: boolean;
  isButtonPressed: boolean;
  isLoading: boolean;
  activeNotifications: Notification[];
  sortedLaterNotifications: Notification[];
  completedNotifications: Notification[];
  incompleteNotifications: Notification[];
  handleNotificationClick: (id: number) => void;
  handleComplete: (id: number) => void;
  handleSortLater: (id: number) => void;
}

export const NotificationsContainer = ({
  isFullWidth,
  isButtonPressed,
  isLoading,
  activeNotifications,
  sortedLaterNotifications,
  completedNotifications,
  incompleteNotifications,
  handleNotificationClick,
  handleComplete,
  handleSortLater,
}: NotificationsContainerProps) => {
  return (
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

        <NotificationTabs 
          activeNotifications={activeNotifications}
          sortedLaterNotifications={sortedLaterNotifications}
          completedNotifications={completedNotifications}
          incompleteNotifications={incompleteNotifications}
          handleNotificationClick={handleNotificationClick}
          handleComplete={handleComplete}
          handleSortLater={handleSortLater}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};
