import React from "react";
import { NotificationCard } from "./NotificationCard";
import { Notification } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BellOff, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NotificationsTabContentProps {
  notifications: Notification[];
  onComplete: (id: number) => void;
  onSortLater: (id: number) => void;
  onNotificationClick: (id: number) => void;
  isCompletedTab?: boolean;
}

export const NotificationsTabContent = ({
  notifications,
  onComplete,
  onSortLater,
  onNotificationClick,
  isCompletedTab = false,
}: NotificationsTabContentProps) => {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <BellOff className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No notifications
        </h3>
        <p className="text-sm text-gray-500">
          When you receive notifications, they will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "group relative bg-white border rounded-lg p-4",
            "transition-all duration-200 ease-in-out",
            "hover:shadow-sm hover:border-gray-300/80",
            "cursor-pointer"
          )}
          onClick={() => onNotificationClick(notification.id)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {notification.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {notification.description}
              </p>
              <div className="mt-2 flex justify-between items-center gap-4 w-full">
                <time
                  className="text-xs text-gray-500"
                  dateTime={notification.date}
                >
                  {notification.date}
                </time>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSortLater(notification.id);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 text-xs rounded-md px-3 py-1",
                      "text-amber-600 hover:text-amber-700 border border-amber-100/0",
                      "hover:bg-amber-50/80 hover:border-amber-100/80",
                      "transition-all duration-200"
                    )}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Sort Later</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onComplete(notification.id);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 text-xs rounded-md px-3 py-1",
                      isCompletedTab
                        ? "text-red-600 hover:text-red-700 border border-red-100/0 hover:bg-red-50/80 hover:border-red-100/80"
                        : "text-emerald-600 hover:text-emerald-700 border border-emerald-100/0 hover:bg-emerald-50/80 hover:border-emerald-100/80",
                      "transition-all duration-200"
                    )}
                  >
                    {isCompletedTab ? (
                      <>
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Mark as Incomplete</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Mark Complete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
