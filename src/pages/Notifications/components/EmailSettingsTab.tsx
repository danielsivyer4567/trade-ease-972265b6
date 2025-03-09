
import React from 'react';
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";

interface EmailSettingsTabProps {
  emailNotificationsEnabled: boolean;
  setEmailNotificationsEnabled: (enabled: boolean) => void;
  forwardingEmail: string;
  setForwardingEmail: (email: string) => void;
  saveEmailSettings: () => void;
  isLoading?: boolean;
}

export const EmailSettingsTab = ({
  emailNotificationsEnabled,
  setEmailNotificationsEnabled,
  forwardingEmail,
  setForwardingEmail,
  saveEmailSettings,
  isLoading = false,
}: EmailSettingsTabProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Mail className="h-5 w-5 text-blue-600" />
        Email Notification Settings
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Checkbox 
            id="email-notifications" 
            checked={emailNotificationsEnabled}
            onCheckedChange={(checked) => setEmailNotificationsEnabled(checked as boolean)}
            className="h-3 w-3"
            disabled={isLoading}
          />
          <Label htmlFor="email-notifications">
            Enable email notifications
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-forwarding">Forward notifications to email</Label>
          <Input 
            id="email-forwarding" 
            type="email" 
            placeholder="your@tradeease.com.au" 
            value={forwardingEmail}
            onChange={(e) => setForwardingEmail(e.target.value)}
            className="h-7 text-sm"
            disabled={isLoading || !emailNotificationsEnabled}
          />
          <p className="text-sm text-gray-500">
            Important notifications will be sent to this email address
          </p>
        </div>
        
        <Button 
          onClick={saveEmailSettings}
          disabled={isLoading || (emailNotificationsEnabled && (!forwardingEmail || !/^\S+@\S+\.\S+$/.test(forwardingEmail)))}
          className="h-7 text-xs py-0 mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Saving...
            </>
          ) : (
            'Save Email Settings'
          )}
        </Button>
      </div>
    </Card>
  );
};
