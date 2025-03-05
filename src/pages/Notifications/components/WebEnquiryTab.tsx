
import React from 'react';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Globe, MessageSquare } from "lucide-react";

interface WebEnquiryTabProps {
  webEnquiryNotifications: boolean;
  setWebEnquiryNotifications: (enabled: boolean) => void;
  enquiryEmail: string;
  setEnquiryEmail: (email: string) => void;
  saveWebEnquirySettings: () => void;
}

export const WebEnquiryTab = ({
  webEnquiryNotifications,
  setWebEnquiryNotifications,
  enquiryEmail,
  setEnquiryEmail,
  saveWebEnquirySettings,
}: WebEnquiryTabProps) => {
  return (
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
            className="h-3 w-3"
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
            className="h-7 text-sm"
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
            className="h-7 text-xs py-0"
          >
            Configure Web Enquiry Form
          </Button>
        </div>

        <Button 
          onClick={saveWebEnquirySettings}
          disabled={webEnquiryNotifications && (!enquiryEmail || !/^\S+@\S+\.\S+$/.test(enquiryEmail))}
          className="h-7 text-xs py-0 mt-4"
        >
          Save Web Enquiry Settings
        </Button>
      </div>
    </Card>
  );
};
