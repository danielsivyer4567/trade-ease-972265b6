import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Check, Bell } from "lucide-react";
import { Notification } from "../types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface NotificationCardProps {
  notification: Notification;
  onComplete: (id: number) => void;
  onSortLater: (id: number) => void;
  onNotificationClick: (id: number) => void;
}

export const NotificationCard = ({
  notification,
  onComplete,
  onSortLater,
  onNotificationClick,
}: NotificationCardProps) => {
  // Format the date string to a more readable format
  const formattedDate = format(new Date(notification.date), 'MMM d, yyyy');
  
  const renderStatusBadge = () => {
    if (notification.isCompleted) {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100">
          <Check className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    }
    if (notification.isSortedLater) {
      return (
        <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100">
          <Clock className="h-3 w-3 mr-1" />
          Sort Later
        </Badge>
      );
    }
    return null;
  };
  
  return (
    <Card 
      className={cn(
        "group relative mb-3 overflow-hidden transition-all duration-200",
        "hover:shadow-md hover:border-primary/20 bg-slate-50/50",
        notification.isCompleted && "",
        notification.isSortedLater && " "
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Notification Icon */}
          <div className="mt-1">
            <Bell className={cn(
              "h-4 w-4",
              notification.isCompleted ? "text-muted-foreground" : "text-primary",
              "transition-colors duration-200"
            )} />
          </div>

          {/* Content Section */}
          <div 
            className="flex-1 cursor-pointer space-y-1" 
            onClick={() => onNotificationClick(notification.id)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className={cn(
                  "font-medium line-clamp-1",
                  notification.isCompleted ? "text-muted-foreground" : "text-foreground"
                )}>
                  {notification.title}
                </h3>
                {renderStatusBadge()}
              </div>
              <time className="text-xs text-muted-foreground whitespace-nowrap">
                {formattedDate}
              </time>
            </div>
            <p className={cn(
              "text-sm text-muted-foreground line-clamp-2",
              notification.isCompleted && "text-muted-foreground/70"
            )}>
              {notification.description}
            </p>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-2 text-xs",
              notification.isSortedLater && "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
            )}
            onClick={() => onSortLater(notification.id)}
          >
            <Clock className="h-3.5 w-3.5 mr-1" />
            {notification.isSortedLater ? "Remove from Later" : "Sort Later"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-2 text-xs",
              notification.isCompleted 
                ? "text-red-600 hover:text-red-700 hover:bg-red-50" 
                : "text-green-600 hover:text-green-700 hover:bg-green-50"
            )}
            onClick={() => onComplete(notification.id)}
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            {notification.isCompleted ? "Mark Incomplete" : "Mark Complete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
