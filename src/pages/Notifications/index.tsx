import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Clock, Check, Mail, Globe, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  title: string;
  description: string;
  date: string;
  isCompleted: boolean;
  isSortedLater: boolean;
}

const NotificationCard = ({
  notification,
  onComplete,
  onSortLater,
  onNotificationClick,
}: {
  notification: Notification;
  onComplete: (id: number) => void;
  onSortLater: (id: number) => void;
  onNotificationClick: (id: number) => void;
}) => (
  <Card key={notification.id} className="p-3 mb-3 cursor-pointer hover:bg-gray-50 border-2 border-black">
    <div className="flex items-start gap-2">
      <div className="flex-1" onClick={() => onNotificationClick(notification.id)}>
        <h3 className="font-medium text-sm">{notification.title}</h3>
        <p className="text-xs text-gray-600">{notification.description}</p>
        <span className="text-xs text-gray-500">{notification.date}</span>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center">
          <Checkbox id={`sort-later-${notification.id}`} checked={notification.isSortedLater} onCheckedChange={() => onSortLater(notification.id)} />
          <label htmlFor={`sort-later-${notification.id}`} className="flex items-center text-xs ml-1">
            <Clock className="h-3 w-3 mr-1" />Later
          </label>
        </div>
        <div className="flex items-center">
          <Checkbox id={`complete-${notification.id}`} checked={notification.isCompleted} onCheckedChange={() => onComplete(notification.id)} />
          <label htmlFor={`complete-${notification.id}`} className="flex items-center text-xs ml-1">
            <Check className="h-3 w-3 mr-1" />Done
          </label>
        </div>
      </div>
    </div>
  </Card>
);

export default function Notifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: 1,
      title: "New Quote Request",
      description: "Customer John Doe requested a quote for roof repair",
      date: "2024-03-20",
      isCompleted: false,
      isSortedLater: false
    },
    {
      id: 2,
      title: "Payment Received",
      description: "Payment received for Invoice #1234",
      date: "2024-03-19",
      isCompleted: false,
      isSortedLater: false
    },
    {
      id: 3,
      title: "Task Overdue",
      description: "Task 'Site inspection' is overdue",
      date: "2024-03-18",
      isCompleted: false,
      isSortedLater: false
    }
  ]);

  const [forwardingEmail, setForwardingEmail] = useState("");
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  
  const [webEnquiryNotifications, setWebEnquiryNotifications] = useState(true);
  const [enquiryEmail, setEnquiryEmail] = useState("");

  const handleNotificationClick = (notificationId: number) => {
    console.log("Navigate to notification details:", notificationId);
  };

  const handleComplete = (notificationId: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isCompleted: !notification.isCompleted, isSortedLater: false }
        : notification
    ));
  };

  const handleSortLater = (notificationId: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isSortedLater: !notification.isSortedLater, isCompleted: false }
        : notification
    ));
  };

  const saveEmailSettings = () => {
    toast({
      title: "Email notification settings saved",
      description: `Forwarding email set to ${forwardingEmail}`,
    });
  };

  const saveWebEnquirySettings = () => {
    toast({
      title: "Web enquiry notification settings saved",
      description: `Notifications will ${webEnquiryNotifications ? "" : "not"} be sent to ${enquiryEmail}`,
    });
  };

  const activeNotifications = notifications.filter(n => !n.isCompleted && !n.isSortedLater);
  const sortedLaterNotifications = notifications.filter(n => n.isSortedLater);
  const completedNotifications = notifications.filter(n => n.isCompleted);

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="active" className="border-2 border-black m-1">
              Active ({activeNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="sort-later" className="relative border-2 border-black m-1">
              Sort Later 
              {sortedLaterNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {sortedLaterNotifications.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="border-2 border-black m-1">
              Completed ({completedNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="email-settings" className="border-2 border-black m-1">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="web-enquiry" className="border-2 border-black m-1">
              <Globe className="h-4 w-4 mr-2" />
              Web Enquiry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {activeNotifications.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onComplete={handleComplete}
                onSortLater={handleSortLater}
                onNotificationClick={handleNotificationClick}
              />
            ))}
          </TabsContent>

          <TabsContent value="sort-later" className="mt-4">
            {sortedLaterNotifications.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onComplete={handleComplete}
                onSortLater={handleSortLater}
                onNotificationClick={handleNotificationClick}
              />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            {completedNotifications.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onComplete={handleComplete}
                onSortLater={handleSortLater}
                onNotificationClick={handleNotificationClick}
              />
            ))}
          </TabsContent>

          <TabsContent value="email-settings" className="mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Email Notification Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="email-notifications-enabled" 
                    checked={emailNotificationsEnabled}
                    onCheckedChange={(checked) => setEmailNotificationsEnabled(checked as boolean)}
                  />
                  <Label htmlFor="email-notifications-enabled">Enable email notifications</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forwarding-email">Forward notifications to email</Label>
                  <Input 
                    id="forwarding-email" 
                    type="email" 
                    placeholder="your@tradeease.com.au" 
                    value={forwardingEmail}
                    onChange={(e) => setForwardingEmail(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    All system notifications will be forwarded to this email address
                  </p>
                </div>
                
                <Button 
                  onClick={saveEmailSettings}
                  disabled={emailNotificationsEnabled && (!forwardingEmail || !/^\S+@\S+\.\S+$/.test(forwardingEmail))}
                >
                  Save Email Settings
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="web-enquiry" className="mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-600" />
                Web Enquiry Form Notifications
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="web-enquiry-notifications" 
                    checked={webEnquiryNotifications}
                    onCheckedChange={(checked) => setWebEnquiryNotifications(checked as boolean)}
                  />
                  <Label htmlFor="web-enquiry-notifications">
                    Receive notifications for web enquiry form submissions
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enquiry-email">Send web enquiries to email</Label>
                  <Input 
                    id="enquiry-email" 
                    type="email" 
                    placeholder="your@tradeease.com.au" 
                    value={enquiryEmail}
                    onChange={(e) => setEnquiryEmail(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Web enquiry form submissions will create notifications and be sent to this email
                  </p>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm mb-2">
                    <MessageSquare className="h-4 w-4 inline mr-1 text-blue-500" />
                    <span className="font-medium">Visit the Email page to configure the web enquiry form design and get the code for your website.</span>
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = "/email"}
                  >
                    Configure Web Enquiry Form
                  </Button>
                </div>

                <Button 
                  onClick={saveWebEnquirySettings}
                  disabled={webEnquiryNotifications && (!enquiryEmail || !/^\S+@\S+\.\S+$/.test(enquiryEmail))}
                  className="mt-4"
                >
                  Save Web Enquiry Settings
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
