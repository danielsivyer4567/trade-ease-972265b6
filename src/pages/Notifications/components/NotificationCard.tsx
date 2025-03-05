
import React from 'react';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Check } from "lucide-react";
import { Notification } from "../types";

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
}: NotificationCardProps) => (
  <Card key={notification.id} className="p-3 mb-3 cursor-pointer hover:bg-gray-50 border border-gray-300">
    <div className="flex items-start gap-2">
      <div className="flex-1" onClick={() => onNotificationClick(notification.id)}>
        <h3 className="font-medium text-sm">{notification.title}</h3>
        <p className="text-xs text-gray-600">{notification.description}</p>
        <span className="text-xs text-gray-500">{notification.date}</span>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center">
          <Checkbox id={`sort-later-${notification.id}`} checked={notification.isSortedLater} onCheckedChange={() => onSortLater(notification.id)} className="h-3 w-3" />
          <label htmlFor={`sort-later-${notification.id}`} className="flex items-center text-xs ml-1">
            <Clock className="h-2 w-2 mr-1" />Later
          </label>
        </div>
        <div className="flex items-center">
          <Checkbox id={`complete-${notification.id}`} checked={notification.isCompleted} onCheckedChange={() => onComplete(notification.id)} className="h-3 w-3" />
          <label htmlFor={`complete-${notification.id}`} className="flex items-center text-xs ml-1">
            <Check className="h-2 w-2 mr-1" />Done
          </label>
        </div>
      </div>
    </div>
  </Card>
);
