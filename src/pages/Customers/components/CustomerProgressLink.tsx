
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { Copy, CheckCircle, Bell, Clock, Link as LinkIcon, Share2, Tag, ListChecks, Settings } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CustomerProgressLinkProps {
  customerId: string;
}

export function CustomerProgressLink({ customerId }: CustomerProgressLinkProps) {
  const [progressLinkUrl, setProgressLinkUrl] = useState(`${window.location.origin}/progress/${customerId}`);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [linkExpiry, setLinkExpiry] = useState<string>("30"); // Days
  const [activationStatus, setActivationStatus] = useState<'active' | 'inactive'>('active');
  const [progressTab, setProgressTab] = useState<string>("settings");
  const [selectedAutomation, setSelectedAutomation] = useState<string>("");
  
  // Mock data for job steps
  const jobSteps = [
    { id: 1, title: 'Consultation', complete: true, description: 'Initial site visit and project scoping' },
    { id: 2, title: 'Materials Ordering', complete: true, description: 'Order and schedule delivery of required materials' },
    { id: 3, title: 'Site Preparation', complete: false, description: 'Prepare the work area for construction' },
    { id: 4, title: 'Construction Phase', complete: false, description: 'Main construction work and installation' },
    { id: 5, title: 'Finishing Work', complete: false, description: 'Final touches and cleanup' },
    { id: 6, title: 'Final Inspection', complete: false, description: 'Quality inspection and approval' }
  ];

  // Mock data for recent updates
  const recentUpdates = [
    { id: 1, date: '2024-04-01', message: 'Materials delivery scheduled for April 5th', user: 'John Smith' },
    { id: 2, date: '2024-04-02', message: 'Site preparation plan approved', user: 'Sarah Johnson' }
  ];

  // Mock data for automations
  const availableAutomations = [
    { id: '1', name: 'Daily Progress Update Email', description: 'Send daily email summary of progress' },
    { id: '2', name: 'Material Delivery Notification', description: 'Send SMS when materials are delivered' },
    { id: '3', name: 'Step Completion Alert', description: 'Send notification when a step is completed' },
    { id: '4', name: 'Photo Update Notification', description: 'Notify when new photos are added' }
  ];

  // Copy progress link to clipboard
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(progressLinkUrl);
    toast.success('Link copied to clipboard');
  };

  // Generate a new progress link
  const regenerateLink = () => {
    const newLinkId = Math.random().toString(36).substring(2, 15);
    setProgressLinkUrl(`${window.location.origin}/progress/${customerId}/${newLinkId}`);
    toast.success('New progress link generated');
  };

  // Send progress link to customer
  const sendLinkToCustomer = () => {
    toast.success('Progress link sent to customer');
  };

  // Toggle notifications
  const toggleNotifications = (checked: boolean) => {
    setNotificationsEnabled(checked);
    toast.success(`Notifications ${checked ? 'enabled' : 'disabled'}`);
  };

  // Apply selected automation
  const applyAutomation = () => {
    if (!selectedAutomation) {
      toast.error('Please select an automation');
      return;
    }
    
    const automation = availableAutomations.find(a => a.id === selectedAutomation);
    toast.success(`Applied automation: ${automation?.name}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Customer Progress Tracking</h2>
        <Badge variant={activationStatus === 'active' ? "success" : "secondary"}>
          {activationStatus === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      </div>
      
      <Tabs defaultValue="settings" value={progressTab} onValueChange={setProgressTab}>
        <TabsList>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Link Settings
          </TabsTrigger>
          <TabsTrigger value="steps">
            <ListChecks className="h-4 w-4 mr-2" />
            Progress Steps
          </TabsTrigger>
          <TabsTrigger value="updates">
            <Clock className="h-4 w-4 mr-2" />
            Recent Updates
          </TabsTrigger>
          <TabsTrigger value="automations">
            <Tag className="h-4 w-4 mr-2" />
            Automations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Progress Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="progress-link">Progress Link URL</Label>
                <div className="flex space-x-2">
                  <Input id="progress-link" value={progressLinkUrl} readOnly className="flex-1" />
                  <Button variant="outline" size="icon" onClick={copyLinkToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={toggleNotifications}
                  />
                  <Label htmlFor="notifications">Enable customer notifications</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="link-expiry">Link Expiry (days)</Label>
                    <Select value={linkExpiry} onValueChange={setLinkExpiry}>
                      <SelectTrigger id="link-expiry">
                        <SelectValue placeholder="Select expiry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="0">No expiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="link-status">Link Status</Label>
                    <Select value={activationStatus} onValueChange={(value: 'active' | 'inactive') => setActivationStatus(value)}>
                      <SelectTrigger id="link-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" onClick={regenerateLink}>
                  <LinkIcon className="h-4 w-4 mr-2" /> Generate New Link
                </Button>
                <Button onClick={sendLinkToCustomer}>
                  <Share2 className="h-4 w-4 mr-2" /> Send to Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="steps" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Job Progress Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobSteps.map((step, index) => (
                  <div key={step.id} className="border rounded p-4 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full h-8 w-8 flex items-center justify-center text-white ${step.complete ? 'bg-green-500' : 'bg-gray-300'}`}>
                          {step.complete ? 
                            <CheckCircle className="h-5 w-5" /> : 
                            <span>{index + 1}</span>
                          }
                        </div>
                        <div>
                          <h4 className="font-medium">{step.title}</h4>
                          <p className="text-sm text-gray-500">{step.description}</p>
                        </div>
                      </div>
                      <Badge variant={step.complete ? "success" : "outline"}>
                        {step.complete ? 'Complete' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    Customize Progress Steps
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="updates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Updates</CardTitle>
            </CardHeader>
            <CardContent>
              {recentUpdates.length > 0 ? (
                <div className="space-y-4">
                  {recentUpdates.map(update => (
                    <div key={update.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{update.message}</p>
                          <p className="text-sm text-gray-500">By: {update.user}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(update.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">No updates yet</div>
              )}
              
              <div className="mt-4 pt-2 border-t">
                <Button variant="outline" className="w-full">
                  Add New Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="automations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Automation Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="automation-select">Select Automation</Label>
                <Select value={selectedAutomation} onValueChange={setSelectedAutomation}>
                  <SelectTrigger id="automation-select">
                    <SelectValue placeholder="Choose an automation" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAutomations.map(automation => (
                      <SelectItem key={automation.id} value={automation.id}>
                        {automation.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedAutomation && (
                  <p className="text-sm text-gray-500 mt-1">
                    {availableAutomations.find(a => a.id === selectedAutomation)?.description}
                  </p>
                )}
              </div>
              
              <div className="pt-2">
                <Button onClick={applyAutomation} disabled={!selectedAutomation}>
                  Apply Automation
                </Button>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-medium mb-2">Applied Automations</h3>
                <div className="text-sm text-gray-500">No automations applied yet</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Tagging & Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Enable customers to tag team members and leave comments on job progress.</p>
                
                <div className="flex items-center space-x-2">
                  <Switch id="customer-tagging" defaultChecked />
                  <Label htmlFor="customer-tagging">Allow customer tagging</Label>
                </div>
                
                <div className="pt-2">
                  <Label htmlFor="tag-permissions" className="mb-2 block">Who can customers tag?</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="tag-workers" checked />
                      <label htmlFor="tag-workers">Workers</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="tag-managers" checked />
                      <label htmlFor="tag-managers">Managers</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="tag-admin" checked />
                      <label htmlFor="tag-admin">Admins</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="tag-owner" />
                      <label htmlFor="tag-owner">Business Owner</label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="font-medium text-blue-800 mb-1">About Progress Tracking</h4>
        <p className="text-sm text-blue-600">
          Share a unique link with your customer so they can track job progress in real-time. 
          They can enable notifications for updates and tag team members with questions or feedback.
        </p>
      </div>
    </div>
  );
}
