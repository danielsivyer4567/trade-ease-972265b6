import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Check } from "lucide-react";
interface Notification {
  id: number;
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  isSortedLater: boolean;
}
export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([{
    id: 1,
    title: "New Quote Request",
    description: "Customer John Doe requested a quote for roof repair",
    date: "2024-03-20",
    isCompleted: false,
    isSortedLater: false
  }, {
    id: 2,
    title: "Payment Received",
    description: "Payment received for Invoice #1234",
    date: "2024-03-19",
    isCompleted: false,
    isSortedLater: false
  }, {
    id: 3,
    title: "Task Overdue",
    description: "Task 'Site inspection' is overdue",
    date: "2024-03-18",
    isCompleted: false,
    isSortedLater: false
  }]);
  const handleNotificationClick = (notificationId: number) => {
    // Handle navigation to relevant page based on notification type
    console.log("Navigate to notification details:", notificationId);
  };
  const handleComplete = (notificationId: number) => {
    setNotifications(notifications.map(notification => notification.id === notificationId ? {
      ...notification,
      isCompleted: !notification.isCompleted,
      isSortedLater: false
    } : notification));
  };
  const handleSortLater = (notificationId: number) => {
    setNotifications(notifications.map(notification => notification.id === notificationId ? {
      ...notification,
      isSortedLater: !notification.isSortedLater,
      isCompleted: false
    } : notification));
  };
  const activeNotifications = notifications.filter(n => !n.isCompleted && !n.isSortedLater);
  const sortedLaterNotifications = notifications.filter(n => n.isSortedLater);
  const completedNotifications = notifications.filter(n => n.isCompleted);
  const NotificationCard = ({
    notification
  }: {
    notification: Notification;
  }) => <Card key={notification.id} className="p-4 mb-4 cursor-pointer hover:bg-gray-50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1" onClick={() => handleNotificationClick(notification.id)}>
          <h3 className="font-medium">{notification.title}</h3>
          <p className="text-sm text-gray-600">{notification.description}</p>
          <span className="text-xs text-gray-500">{notification.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox id={`sort-later-${notification.id}`} checked={notification.isSortedLater} onCheckedChange={() => handleSortLater(notification.id)} className="label this sort later" />
            <label htmlFor={`sort-later-${notification.id}`} className="text-sm text-gray-600">
              <Clock className="h-4 w-4" />
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id={`complete-${notification.id}`} checked={notification.isCompleted} onCheckedChange={() => handleComplete(notification.id)} />
            <label htmlFor={`complete-${notification.id}`} className="text-sm text-gray-600">
              <Check className="h-4 w-4" />
            </label>
          </div>
        </div>
      </div>
    </Card>;
  return <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">
              Active ({activeNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="sort-later">
              Sort Later ({sortedLaterNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {activeNotifications.map(notification => <NotificationCard key={notification.id} notification={notification} />)}
          </TabsContent>

          <TabsContent value="sort-later" className="mt-4">
            {sortedLaterNotifications.map(notification => <NotificationCard key={notification.id} notification={notification} />)}
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            {completedNotifications.map(notification => <NotificationCard key={notification.id} notification={notification} />)}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>;
}