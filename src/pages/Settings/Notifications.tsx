
import { Bell } from "lucide-react";
import SettingsPageTemplate from "./SettingsPageTemplate";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useNotifications } from "@/pages/Notifications/hooks/useNotifications";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function NotificationsSettings() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultTab = searchParams.get("tab") || "general";
  const {
    forwardingEmail,
    setForwardingEmail,
    emailNotificationsEnabled,
    setEmailNotificationsEnabled,
    saveEmailSettings,
    webEnquiryNotifications,
    setWebEnquiryNotifications,
    enquiryEmail,
    setEnquiryEmail,
    saveWebEnquirySettings,
    isLoading
  } = useNotifications();

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
            
            <div className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={emailNotificationsEnabled}
                  onCheckedChange={setEmailNotificationsEnabled}
                />
              </div>
              
              {emailNotificationsEnabled && (
                <div className="space-y-3">
                  <Label htmlFor="forwarding-email">Forwarding Email</Label>
                  <Input 
                    id="forwarding-email"
                    type="email"
                    placeholder="your@email.com"
                    value={forwardingEmail}
                    onChange={(e) => setForwardingEmail(e.target.value)}
                  />
                  <Button 
                    onClick={saveEmailSettings}
                    disabled={isLoading || !forwardingEmail.trim() || !/\S+@\S+\.\S+/.test(forwardingEmail)}
                  >
                    {isLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="web-enquiry" className="space-y-4">
            <h2 className="text-lg font-medium">Web Enquiry Form Settings</h2>
            <p className="text-gray-600">Configure how web enquiries are processed and notified.</p>
            
            <div className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md font-medium">Web Enquiry Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications when customers submit web enquiries</p>
                </div>
                <Switch 
                  checked={webEnquiryNotifications}
                  onCheckedChange={setWebEnquiryNotifications}
                />
              </div>
              
              {webEnquiryNotifications && (
                <div className="space-y-3">
                  <Label htmlFor="enquiry-email">Send Notifications To</Label>
                  <Input 
                    id="enquiry-email"
                    type="email"
                    placeholder="enquiries@yourcompany.com"
                    value={enquiryEmail}
                    onChange={(e) => setEnquiryEmail(e.target.value)}
                  />
                  <Button 
                    onClick={saveWebEnquirySettings}
                    disabled={isLoading || !enquiryEmail.trim() || !/\S+@\S+\.\S+/.test(enquiryEmail)}
                  >
                    {isLoading ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsPageTemplate>
  );
}
