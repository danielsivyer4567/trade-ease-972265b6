
import { Bell } from "lucide-react";
import SettingsPageTemplate from "./SettingsPageTemplate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function NotificationsSettings() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultTab = searchParams.get("tab") || "general";

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    navigate(`/settings/notifications?tab=${value}`);
  };

  return (
    <SettingsPageTemplate title="Notifications" icon={<Bell className="h-6 w-6" />}>
      <div className="bg-white rounded-lg shadow p-6">
        <Tabs defaultValue={defaultTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="web-enquiry">Web Enquiry Form</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <h2 className="text-lg font-medium">General Notification Settings</h2>
            <p className="text-gray-600">Configure how you receive notifications about jobs, customers, and other important updates.</p>
            
            {/* Content from the main Notifications page would go here */}
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <h2 className="text-lg font-medium">Email Notification Settings</h2>
            <p className="text-gray-600">Configure which emails you receive and how often.</p>
            
            {/* Email notification settings */}
          </TabsContent>
          
          <TabsContent value="web-enquiry" className="space-y-4">
            <h2 className="text-lg font-medium">Web Enquiry Form Settings</h2>
            <p className="text-gray-600">Configure how web enquiries are processed and notified.</p>
            
            {/* Web enquiry form settings */}
          </TabsContent>
        </Tabs>
      </div>
    </SettingsPageTemplate>
  );
}
