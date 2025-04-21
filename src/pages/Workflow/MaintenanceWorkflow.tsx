import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { WorkflowNavigation } from './components/WorkflowNavigation';
import MaintenanceWorkflowSection from './components/MaintenanceWorkflowSection';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, CalendarCheck, Repeat, ClipboardList, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function MaintenanceWorkflow() {
  const [activeTab, setActiveTab] = useState("overview");

  const handleCreatePlanClick = () => {
    toast.info('Create maintenance plan feature coming soon');
  };
  
  const handleScheduleVisitClick = () => {
    toast.info('Schedule maintenance visit feature coming soon');
  };
  
  const handleTaskListClick = () => {
    toast.info('Maintenance task list feature coming soon');
  };
  
  const handleAlertClick = () => {
    toast.info('Maintenance alerts feature coming soon');
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Maintenance & Follow-up Workflow</h1>
            <p className="text-muted-foreground">Manage maintenance plans, scheduled visits, and follow-up tasks</p>
          </div>
          
          <WorkflowNavigation />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="recurring">Recurring Plans</TabsTrigger>
              <TabsTrigger value="visits">Scheduled Visits</TabsTrigger>
              <TabsTrigger value="follow-up">Follow-up Tasks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="cursor-pointer hover:bg-gray-50" onClick={handleCreatePlanClick}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Create Maintenance Plan</CardTitle>
                    <Repeat className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Create recurring maintenance schedules for your customers</p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-gray-50" onClick={handleScheduleVisitClick}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Schedule Visit</CardTitle>
                    <CalendarCheck className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Schedule one-time or recurring maintenance visits</p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-gray-50" onClick={handleTaskListClick}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Task Checklists</CardTitle>
                    <ClipboardList className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Create and manage maintenance task checklists</p>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-gray-50" onClick={handleAlertClick}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Alerts & Reminders</CardTitle>
                    <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Set up automatic alerts for maintenance schedules</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <MaintenanceWorkflowSection />
              </div>
            </TabsContent>
            
            <TabsContent value="recurring">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recurring Maintenance Plans</CardTitle>
                      <CardDescription>Create and manage recurring maintenance plans for your customers</CardDescription>
                    </div>
                    <Button onClick={handleCreatePlanClick} className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      New Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">This feature is coming soon</p>
                    <Button variant="outline" onClick={handleCreatePlanClick}>
                      Create Your First Maintenance Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="visits">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Scheduled Maintenance Visits</CardTitle>
                      <CardDescription>View and manage upcoming and completed maintenance visits</CardDescription>
                    </div>
                    <Button onClick={handleScheduleVisitClick} className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Schedule Visit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">This feature is coming soon</p>
                    <Button variant="outline" onClick={handleScheduleVisitClick}>
                      Schedule Your First Maintenance Visit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="follow-up">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Follow-up Tasks</CardTitle>
                      <CardDescription>Track and manage follow-up tasks from maintenance visits</CardDescription>
                    </div>
                    <Button onClick={handleTaskListClick} className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      New Task
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">This feature is coming soon</p>
                    <Button variant="outline" onClick={handleTaskListClick}>
                      Create Your First Follow-up Task
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
} 