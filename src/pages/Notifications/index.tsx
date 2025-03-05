
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Mail, Globe } from "lucide-react";
import { NotificationsTabContent } from './components/NotificationsTabContent';
import { EmailSettingsTab } from './components/EmailSettingsTab';
import { WebEnquiryTab } from './components/WebEnquiryTab';
import { useNotifications } from './hooks/useNotifications';

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
    saveWebEnquirySettings
  } = useNotifications();

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="active" className="border-2 border-black m-1 py-1 h-9">
              Active ({activeNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="sort-later" className="relative border-2 border-black m-1 py-1 h-9">
              Sort Later 
              {sortedLaterNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {sortedLaterNotifications.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="border-2 border-black m-1 py-1 h-9">
              Completed ({completedNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="email-settings" className="border-2 border-black m-1 py-1 h-9">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="web-enquiry" className="border-2 border-black m-1 py-1 h-9">
              <Globe className="h-4 w-4 mr-2" />
              Web Enquiry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-8">
            <NotificationsTabContent
              notifications={activeNotifications}
              onComplete={handleComplete}
              onSortLater={handleSortLater}
              onNotificationClick={handleNotificationClick}
            />
          </TabsContent>

          <TabsContent value="sort-later" className="mt-8">
            <NotificationsTabContent
              notifications={sortedLaterNotifications}
              onComplete={handleComplete}
              onSortLater={handleSortLater}
              onNotificationClick={handleNotificationClick}
            />
          </TabsContent>

          <TabsContent value="completed" className="mt-8">
            <NotificationsTabContent
              notifications={completedNotifications}
              onComplete={handleComplete}
              onSortLater={handleSortLater}
              onNotificationClick={handleNotificationClick}
            />
          </TabsContent>

          <TabsContent value="email-settings" className="mt-8">
            <EmailSettingsTab
              emailNotificationsEnabled={emailNotificationsEnabled}
              setEmailNotificationsEnabled={setEmailNotificationsEnabled}
              forwardingEmail={forwardingEmail}
              setForwardingEmail={setForwardingEmail}
              saveEmailSettings={saveEmailSettings}
            />
          </TabsContent>

          <TabsContent value="web-enquiry" className="mt-8">
            <WebEnquiryTab
              webEnquiryNotifications={webEnquiryNotifications}
              setWebEnquiryNotifications={setWebEnquiryNotifications}
              enquiryEmail={enquiryEmail}
              setEnquiryEmail={setEnquiryEmail}
              saveWebEnquirySettings={saveWebEnquirySettings}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
