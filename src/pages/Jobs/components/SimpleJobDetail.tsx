import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Calendar, Clock, Box, MessageSquare, BarChart4, Settings, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Job } from "@/types/job";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface JobDetailProps {
  job: Job;
}

export const SimpleJobDetail = ({ job }: JobDetailProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const [showProcessSettingsDialog, setShowProcessSettingsDialog] = useState(false);
  const [maxSteps, setMaxSteps] = useState(5);
  const [requireAllSteps, setRequireAllSteps] = useState(false);
  
  // Function to save process settings
  const saveProcessSettings = () => {
    // Here we would typically save settings to backend
    toast.success("Process settings saved successfully");
    setShowProcessSettingsDialog(false);
  };
  
  return (
    <div className="w-full h-full bg-gray-100">
      {/* Map/Location header section */}
      <div className="relative h-64 bg-gray-300">
        <div className="absolute inset-0">
          {/* This would be a map component */}
          <img 
            src="https://maps.googleapis.com/maps/api/staticmap?center=-33.8688,151.2093&zoom=14&size=800x250&key=YOUR_API_KEY" 
            alt="Location map"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Customer info and action buttons */}
      <div className="bg-gray-100 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 lowercase">{job.customer}</h1>
            <p className="text-gray-600">{job.type}</p>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                {job.status}
              </span>
              <span className="ml-2 text-sm text-gray-500">{job.date}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => setShowProcessSettingsDialog(true)}
            >
              <Settings className="h-4 w-4 mr-1" /> Process Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 md:grid-cols-7 bg-white border-t border-b border-gray-200">
          <TabsTrigger value="details" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
            Details
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
            <FileText className="h-4 w-4 md:mr-1 md:inline hidden" /> Notes
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
            <Calendar className="h-4 w-4 md:mr-1 md:inline hidden" /> Calendar
          </TabsTrigger>
          <TabsTrigger value="timer" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
            <Clock className="h-4 w-4 md:mr-1 md:inline hidden" /> Timer
          </TabsTrigger>
          <TabsTrigger value="materials" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
            <Box className="h-4 w-4 md:mr-1 md:inline hidden" /> Materials
          </TabsTrigger>
          <TabsTrigger value="financials" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
            <BarChart4 className="h-4 w-4 md:mr-1 md:inline hidden" /> Financials
          </TabsTrigger>
          <TabsTrigger value="conversations" className="text-xs md:text-sm py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
            <MessageSquare className="h-4 w-4 md:mr-1 md:inline hidden" /> Conversations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Job Number</p>
                    <p>{job.jobNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p>{job.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p>{job.address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p>{job.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Team</p>
                    <p>{job.assignedTeam || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p>{job.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Job Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {job.job_steps && job.job_steps.length > 0 ? (
                    job.job_steps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          step.isCompleted ? 'bg-green-500 text-white' : 'border border-gray-300'
                        }`}>
                          {step.isCompleted && '✓'}
                        </div>
                        <span>{step.title}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No process steps defined for this job</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="p-4">
          <div className="text-center py-10 text-gray-500">
            Notes content will be displayed here.
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="p-4">
          <div className="text-center py-10 text-gray-500">Calendar content will be displayed here</div>
        </TabsContent>

        <TabsContent value="timer" className="p-4">
          <div className="text-center py-10 text-gray-500">Timer content will be displayed here</div>
        </TabsContent>

        <TabsContent value="materials" className="p-4">
          <div className="text-center py-10 text-gray-500">Materials content will be displayed here</div>
        </TabsContent>

        <TabsContent value="financials" className="p-4">
          <div className="text-center py-10 text-gray-500">Financials content will be displayed here</div>
        </TabsContent>

        <TabsContent value="conversations" className="p-4">
          <div className="text-center py-10 text-gray-500">Conversations content will be displayed here</div>
        </TabsContent>
      </Tabs>
      
      {/* Process Settings Dialog */}
      <Dialog open={showProcessSettingsDialog} onOpenChange={setShowProcessSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Job Process Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="max-steps">Maximum Number of Steps</Label>
              <Input
                id="max-steps"
                type="number"
                min={1}
                max={20}
                value={maxSteps}
                onChange={(e) => setMaxSteps(parseInt(e.target.value))}
              />
              <p className="text-sm text-gray-500">Maximum 20 steps allowed</p>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="require-all-steps">Require All Steps to Complete Job</Label>
              <Switch
                id="require-all-steps"
                checked={requireAllSteps}
                onCheckedChange={setRequireAllSteps}
              />
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button onClick={saveProcessSettings} className="w-full">
                <Check className="h-4 w-4 mr-1" /> Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 