import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, Globe, Bell, Clock, CheckCircle2 } from "lucide-react";
import { NotificationsTabContent } from './components/NotificationsTabContent';
import { EmailSettingsTab } from './components/EmailSettingsTab';
import { WebEnquiryTab } from './components/WebEnquiryTab';
import { useNotifications } from './hooks/useNotifications';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function Notifications() {
  const {
    activeNotifications,
    sortedLaterNotifications,
    completedNotifications,
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
    isLoading
  } = useNotifications();

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Manage your notifications and communication preferences
            </p>
          </div>
        </div>
        
        <Card className="p-6">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1 mb-6">
              <TabsTrigger 
                value="active" 
                className={cn(
                  "flex items-center gap-2 data-[state=active]:bg-primary/10",
                  "py-2.5 px-3 h-auto"
                )}
              >
                <Bell className="h-4 w-4" />
                <span>Active</span>
                {activeNotifications.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {activeNotifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              
              <TabsTrigger 
                value="sort-later" 
                className={cn(
                  "flex items-center gap-2 data-[state=active]:bg-yellow-100",
                  "py-2.5 px-3 h-auto relative"
                )}
              >
                <Clock className="h-4 w-4" />
                <span>Sort Later</span>
                {sortedLaterNotifications.length > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-yellow-100 text-yellow-700">
                    {sortedLaterNotifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              
              <TabsTrigger 
                value="completed" 
                className={cn(
                  "flex items-center gap-2 data-[state=active]:bg-green-100",
                  "py-2.5 px-3 h-auto"
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Completed</span>
                {completedNotifications.length > 0 && (
                  <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                    {completedNotifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              
              <TabsTrigger 
                value="email-settings" 
                className="flex items-center gap-2 data-[state=active]:bg-primary/10 py-2.5 px-3 h-auto"
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="web-enquiry" 
                className="flex items-center gap-2 data-[state=active]:bg-primary/10 py-2.5 px-3 h-auto"
              >
                <Globe className="h-4 w-4" />
                <span>Web Enquiry</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-0">
              <NotificationsTabContent 
                notifications={activeNotifications} 
                onComplete={handleComplete} 
                onSortLater={handleSortLater} 
                onNotificationClick={handleNotificationClick} 
              />
            </TabsContent>

            <TabsContent value="sort-later" className="mt-0">
              <NotificationsTabContent 
                notifications={sortedLaterNotifications} 
                onComplete={handleComplete} 
                onSortLater={handleSortLater} 
                onNotificationClick={handleNotificationClick} 
              />
            </TabsContent>

            <TabsContent value="completed" className="mt-0">
              <NotificationsTabContent 
                notifications={completedNotifications} 
                onComplete={handleComplete} 
                onSortLater={handleSortLater} 
                onNotificationClick={handleNotificationClick} 
              />
            </TabsContent>

            <TabsContent value="email-settings" className="mt-0">
              <EmailSettingsTab 
                emailNotificationsEnabled={emailNotificationsEnabled} 
                setEmailNotificationsEnabled={setEmailNotificationsEnabled} 
                forwardingEmail={forwardingEmail} 
                setForwardingEmail={setForwardingEmail} 
                saveEmailSettings={saveEmailSettings}
                isLoading={isLoading} 
              />
            </TabsContent>

            <TabsContent value="web-enquiry" className="mt-0">
              <WebEnquiryTab 
                webEnquiryNotifications={webEnquiryNotifications} 
                setWebEnquiryNotifications={setWebEnquiryNotifications} 
                enquiryEmail={enquiryEmail} 
                setEnquiryEmail={setEnquiryEmail} 
                saveWebEnquirySettings={saveWebEnquirySettings}
                isLoading={isLoading} 
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  );
}
