import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, AlertCircle, Clock, Users, Webhook, Database, Shield, Activity, Settings2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkflowSettingsProps {
  onSettingsChange: (settings: any) => void;
}

export function WorkflowSettings({ onSettingsChange }: WorkflowSettingsProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Advanced Execution Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Execution Controls</h3>
        </div>
        
        <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Parallel Processing</Label>
              <p className="text-sm text-muted-foreground">
                Enable multiple branches of the workflow to execute simultaneously for improved performance.
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Error Recovery</Label>
              <p className="text-sm text-muted-foreground">
                Automatically retry failed actions and continue workflow execution from the last successful step.
              </p>
            </div>
            <Switch />
          </div>

          <div className="space-y-2">
            <Label>Execution Priority</Label>
            <Select defaultValue="normal">
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Set execution priority for this workflow when system resources are constrained.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section - Enhanced */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Contact</h3>
        </div>
        
        <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow re-entry</Label>
              <p className="text-sm text-muted-foreground">
                Allows a Contact to re-enter once it has left this workflow. If the Contact attempts to re-enter while it is still enrolled in this workflow, it will get skipped. Also if this workflow has appointment or invoice based triggers it will allow Contact to re-enter even if the 'Allow re-entry' setting is disabled.
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow multiple opportunities</Label>
              <p className="text-sm text-muted-foreground">
                Allows a contact with multiple opportunities to enter the workflow as separate executions. For each opportunity, the contact will have a distinct execution in the workflow. Even if 'Allow Re-entry' is disabled, multiple opportunities will still enter the workflow.
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Stop on response</Label>
              <p className="text-sm text-muted-foreground">
                Ends workflow for a contact if the contact responds to a message that is sent from this workflow.
              </p>
            </div>
            <Switch />
          </div>

          {/* New: Advanced Contact Settings */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Contact Deduplication</Label>
              <p className="text-sm text-muted-foreground">
                Automatically merge duplicate contacts based on email, phone, or custom fields.
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Progressive Profiling</Label>
              <p className="text-sm text-muted-foreground">
                Gradually collect additional contact information through workflow interactions.
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Communication Section - Enhanced */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Communication</h3>
        </div>
        
        <div className="space-y-6 bg-slate-50 p-4 rounded-lg">
          <div className="space-y-2">
            <Label>Timezone</Label>
            <Select defaultValue="account">
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account">Account Timezone</SelectItem>
                <SelectItem value="contact">Contact Timezone</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="custom">Custom Timezone</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Wait steps and Time window executions will proceed based on this timezone.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Time Window</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="text-sm">Start Time</Label>
                <Input type="time" defaultValue="09:00" />
              </div>
              <div className="flex-1">
                <Label className="text-sm">End Time</Label>
                <Input type="time" defaultValue="17:00" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Restrict actions from being sent outside the window you define.
            </p>
          </div>

          {/* Enhanced: Communication Channels */}
          <div className="space-y-2">
            <Label>Communication Channels</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 border p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label>Email</Label>
                  <Switch />
                </div>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bulk">Bulk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 border p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label>SMS</Label>
                  <Switch />
                </div>
                <Select defaultValue="transactional">
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 border p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label>WhatsApp</Label>
                  <Switch />
                </div>
                <Select defaultValue="template">
                  <SelectTrigger>
                    <SelectValue placeholder="Message Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="template">Template Message</SelectItem>
                    <SelectItem value="session">Session Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 border p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label>Push Notifications</Label>
                  <Switch />
                </div>
                <Select defaultValue="standard">
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="silent">Silent</SelectItem>
                    <SelectItem value="rich">Rich Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* New: Advanced Communication Settings */}
          <div className="space-y-2">
            <Label>Fallback Configuration</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch />
                <Label>Enable channel fallback</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically try alternative channels if primary channel fails.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Rate Limiting</Label>
            <div className="flex items-center gap-4">
              <Input type="number" placeholder="Max messages per hour" />
              <Select defaultValue="hour">
                <SelectTrigger>
                  <SelectValue placeholder="Time unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minute">Per Minute</SelectItem>
                  <SelectItem value="hour">Per Hour</SelectItem>
                  <SelectItem value="day">Per Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Sender Details Section - Enhanced */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Sender Details</h3>
        </div>
        
        <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
          <div className="space-y-2">
            <Label>From Name</Label>
            <div className="flex gap-2">
              <Input placeholder="Enter sender name" />
              <Button variant="outline" size="icon">
                <Link className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>From Email</Label>
            <div className="flex gap-2">
              <Input type="email" placeholder="Enter sender email" />
              <Button variant="outline" size="icon">
                <Link className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              You can set a default "From name" and "From email" for emails. You can also override this information within your Email actions.
            </p>
          </div>

          <div className="space-y-2">
            <Label>From Number</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select From Number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">+1 (555) 123-4567</SelectItem>
                <SelectItem value="2">+1 (555) 987-6543</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              You can set a default "From Number" for SMS by selecting a number from the dropdown.
            </p>
          </div>

          {/* New: Sender Verification */}
          <div className="space-y-2">
            <Label>Domain Verification</Label>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 bg-green-50">Verified</Badge>
              <Button variant="outline" size="sm">Manage Domains</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sender Rotation</Label>
            <Switch />
            <p className="text-sm text-muted-foreground">
              Automatically rotate between verified senders to improve deliverability.
            </p>
          </div>
        </div>
      </div>

      {/* Conversations Section - Enhanced */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Conversations & AI</h3>
        </div>
        
        <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mark as read</Label>
              <p className="text-sm text-muted-foreground">
                Toggle this on if you want the conversations that this Workflow will interact with to be marked as read.
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-archive completed conversations</Label>
              <p className="text-sm text-muted-foreground">
                Automatically archive conversations when workflow execution is complete.
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable smart responses</Label>
              <p className="text-sm text-muted-foreground">
                Use AI to categorize and route incoming responses appropriately.
              </p>
            </div>
            <Switch />
          </div>

          {/* New: Advanced AI Features */}
          <div className="space-y-2">
            <Label>AI Response Generation</Label>
            <Select defaultValue="basic">
              <SelectTrigger>
                <SelectValue placeholder="Select AI mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic Responses</SelectItem>
                <SelectItem value="advanced">Advanced (GPT-4)</SelectItem>
                <SelectItem value="custom">Custom Model</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sentiment Analysis</Label>
            <div className="flex items-center gap-2">
              <Switch />
              <p className="text-sm text-muted-foreground">
                Analyze response sentiment and adjust workflow accordingly.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Language Processing</Label>
            <div className="flex items-center gap-2">
              <Switch />
              <p className="text-sm text-muted-foreground">
                Automatically detect and respond in the contact's preferred language.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* New: Integration & Webhooks */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Webhook className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Integrations & Webhooks</h3>
        </div>
        
        <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
          <div className="space-y-2">
            <Label>Webhook Notifications</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch />
                <Label>Send webhook on workflow start</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch />
                <Label>Send webhook on workflow completion</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch />
                <Label>Send webhook on error</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <div className="flex gap-2">
              <Input placeholder="https://your-webhook-url.com" />
              <Button variant="outline">Test</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Custom Headers</Label>
            <Textarea placeholder="Enter custom headers in JSON format" className="h-24" />
          </div>
        </div>
      </div>

      {/* New: Analytics & Tracking */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Analytics & Tracking</h3>
        </div>
        
        <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
          <div className="space-y-2">
            <Label>Event Tracking</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch />
                <Label>Track email opens</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch />
                <Label>Track link clicks</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch />
                <Label>Track form submissions</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Custom Events</Label>
            <div className="flex gap-2">
              <Input placeholder="Event name" />
              <Button variant="outline">Add Event</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Analytics Integration</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select analytics platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ga4">Google Analytics 4</SelectItem>
                <SelectItem value="segment">Segment</SelectItem>
                <SelectItem value="mixpanel">Mixpanel</SelectItem>
                <SelectItem value="custom">Custom Integration</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Compliance Warning */}
      <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-600">
          Ensure all communication settings comply with relevant regulations (GDPR, CCPA, CAN-SPAM, etc.).
          Review your settings periodically to maintain compliance.
        </AlertDescription>
      </Alert>
    </div>
  );
} 