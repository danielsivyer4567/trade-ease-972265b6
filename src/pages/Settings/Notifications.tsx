
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, MessageSquare, Smartphone, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function NotificationsPage() {
  const [emailSettings, setEmailSettings] = useState({
    newJobs: true,
    jobUpdates: true,
    customerMessages: true,
    teamChanges: true,
    paymentConfirmations: true,
    weeklyReports: true,
    tipsAndTricks: false,
    marketingEmails: false
  });

  const [pushSettings, setPushSettings] = useState({
    newJobs: true,
    jobAssignments: true,
    jobStatusChanges: true,
    urgentMessages: true,
    customerRequests: true,
    paymentNotifications: true,
    teamMessages: true,
    systemUpdates: false
  });

  const [smsSettings, setSmsSettings] = useState({
    urgentAlerts: true,
    jobAssignments: false,
    paymentConfirmations: false,
    customerResponses: true
  });

  const handleEmailToggle = (setting: keyof typeof emailSettings) => {
    setEmailSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handlePushToggle = (setting: keyof typeof pushSettings) => {
    setPushSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSmsToggle = (setting: keyof typeof smsSettings) => {
    setSmsSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save the settings to an API
    toast.success("Notification preferences saved successfully!");
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Bell className="h-8 w-8 text-gray-700" />
          <h1 className="text-3xl font-bold">Notification Settings</h1>
        </div>

        <Tabs defaultValue="email">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
            <TabsTrigger value="email" className="flex gap-2 items-center">
              <Mail className="h-4 w-4" />
              <span className="hidden md:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="push" className="flex gap-2 items-center">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Push</span>
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex gap-2 items-center">
              <Smartphone className="h-4 w-4" />
              <span className="hidden md:inline">SMS</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Manage which emails you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Jobs & Customers</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-new-jobs">New job alerts</Label>
                        <p className="text-sm text-gray-500">
                          Receive emails when new jobs are created
                        </p>
                      </div>
                      <Switch
                        id="email-new-jobs"
                        checked={emailSettings.newJobs}
                        onCheckedChange={() => handleEmailToggle('newJobs')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-job-updates">Job status updates</Label>
                        <p className="text-sm text-gray-500">
                          Receive emails when job status changes
                        </p>
                      </div>
                      <Switch
                        id="email-job-updates"
                        checked={emailSettings.jobUpdates}
                        onCheckedChange={() => handleEmailToggle('jobUpdates')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-customer-messages">Customer communications</Label>
                        <p className="text-sm text-gray-500">
                          Receive emails when customers send messages
                        </p>
                      </div>
                      <Switch
                        id="email-customer-messages"
                        checked={emailSettings.customerMessages}
                        onCheckedChange={() => handleEmailToggle('customerMessages')}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Team & Payments</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-team-changes">Team changes</Label>
                        <p className="text-sm text-gray-500">
                          Receive emails about team member updates
                        </p>
                      </div>
                      <Switch
                        id="email-team-changes"
                        checked={emailSettings.teamChanges}
                        onCheckedChange={() => handleEmailToggle('teamChanges')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-payment-confirmations">Payment confirmations</Label>
                        <p className="text-sm text-gray-500">
                          Receive emails for payment confirmations
                        </p>
                      </div>
                      <Switch
                        id="email-payment-confirmations"
                        checked={emailSettings.paymentConfirmations}
                        onCheckedChange={() => handleEmailToggle('paymentConfirmations')}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Reports & Marketing</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-weekly-reports">Weekly reports</Label>
                        <p className="text-sm text-gray-500">
                          Receive weekly summary reports
                        </p>
                      </div>
                      <Switch
                        id="email-weekly-reports"
                        checked={emailSettings.weeklyReports}
                        onCheckedChange={() => handleEmailToggle('weeklyReports')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-tips">Tips and tricks</Label>
                        <p className="text-sm text-gray-500">
                          Receive helpful tips for using Trade Ease
                        </p>
                      </div>
                      <Switch
                        id="email-tips"
                        checked={emailSettings.tipsAndTricks}
                        onCheckedChange={() => handleEmailToggle('tipsAndTricks')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-marketing">Marketing emails</Label>
                        <p className="text-sm text-gray-500">
                          Receive emails about new features and offers
                        </p>
                      </div>
                      <Switch
                        id="email-marketing"
                        checked={emailSettings.marketingEmails}
                        onCheckedChange={() => handleEmailToggle('marketingEmails')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="push">
            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Manage notifications on your devices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Jobs</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-new-jobs">New jobs</Label>
                        <p className="text-sm text-gray-500">
                          Receive push notifications for new jobs
                        </p>
                      </div>
                      <Switch
                        id="push-new-jobs"
                        checked={pushSettings.newJobs}
                        onCheckedChange={() => handlePushToggle('newJobs')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-job-assignments">Job assignments</Label>
                        <p className="text-sm text-gray-500">
                          Get notified when you're assigned to a job
                        </p>
                      </div>
                      <Switch
                        id="push-job-assignments"
                        checked={pushSettings.jobAssignments}
                        onCheckedChange={() => handlePushToggle('jobAssignments')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-status-changes">Status changes</Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications when job status changes
                        </p>
                      </div>
                      <Switch
                        id="push-status-changes"
                        checked={pushSettings.jobStatusChanges}
                        onCheckedChange={() => handlePushToggle('jobStatusChanges')}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Communications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-urgent-messages">Urgent messages</Label>
                        <p className="text-sm text-gray-500">
                          Get notifications for urgent messages
                        </p>
                      </div>
                      <Switch
                        id="push-urgent-messages"
                        checked={pushSettings.urgentMessages}
                        onCheckedChange={() => handlePushToggle('urgentMessages')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-customer-requests">Customer requests</Label>
                        <p className="text-sm text-gray-500">
                          Get notifications for customer requests
                        </p>
                      </div>
                      <Switch
                        id="push-customer-requests"
                        checked={pushSettings.customerRequests}
                        onCheckedChange={() => handlePushToggle('customerRequests')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-team-messages">Team messages</Label>
                        <p className="text-sm text-gray-500">
                          Get notifications for team communications
                        </p>
                      </div>
                      <Switch
                        id="push-team-messages"
                        checked={pushSettings.teamMessages}
                        onCheckedChange={() => handlePushToggle('teamMessages')}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Other</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-payment-notifications">Payment notifications</Label>
                        <p className="text-sm text-gray-500">
                          Get notifications for payments
                        </p>
                      </div>
                      <Switch
                        id="push-payment-notifications"
                        checked={pushSettings.paymentNotifications}
                        onCheckedChange={() => handlePushToggle('paymentNotifications')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-system-updates">System updates</Label>
                        <p className="text-sm text-gray-500">
                          Get notifications for Trade Ease updates
                        </p>
                      </div>
                      <Switch
                        id="push-system-updates"
                        checked={pushSettings.systemUpdates}
                        onCheckedChange={() => handlePushToggle('systemUpdates')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms">
            <Card>
              <CardHeader>
                <CardTitle>SMS Notifications</CardTitle>
                <CardDescription>Manage text message notifications (standard rates may apply)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    SMS notifications are used only for high-priority information. Standard message rates may apply.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-urgent-alerts">Urgent alerts</Label>
                        <p className="text-sm text-gray-500">
                          Receive text messages for urgent situations
                        </p>
                      </div>
                      <Switch
                        id="sms-urgent-alerts"
                        checked={smsSettings.urgentAlerts}
                        onCheckedChange={() => handleSmsToggle('urgentAlerts')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-job-assignments">Job assignments</Label>
                        <p className="text-sm text-gray-500">
                          Receive text messages for new job assignments
                        </p>
                      </div>
                      <Switch
                        id="sms-job-assignments"
                        checked={smsSettings.jobAssignments}
                        onCheckedChange={() => handleSmsToggle('jobAssignments')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-payment-confirmations">Payment confirmations</Label>
                        <p className="text-sm text-gray-500">
                          Receive text messages for payment confirmations
                        </p>
                      </div>
                      <Switch
                        id="sms-payment-confirmations"
                        checked={smsSettings.paymentConfirmations}
                        onCheckedChange={() => handleSmsToggle('paymentConfirmations')}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-customer-responses">Customer responses</Label>
                        <p className="text-sm text-gray-500">
                          Receive text messages when customers respond
                        </p>
                      </div>
                      <Switch
                        id="sms-customer-responses"
                        checked={smsSettings.customerResponses}
                        onCheckedChange={() => handleSmsToggle('customerResponses')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>
            <Check className="mr-2 h-4 w-4" />
            Save Preferences
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
