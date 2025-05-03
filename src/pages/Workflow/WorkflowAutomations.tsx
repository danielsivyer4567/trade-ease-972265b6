import React, { useState, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { WorkflowNavigation } from './components/WorkflowNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Calendar, Mail, Building, Check, ArrowRightLeft, FileText, Briefcase, Users } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Automation {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  triggers: string[];
  actions: string[];
  category: string;
  premium?: boolean;
}

const AUTOMATION_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'team', label: 'Team' },
  { id: 'sales', label: 'Sales' },
  { id: 'forms', label: 'Forms' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'social', label: 'Social Media' },
  { id: 'messaging', label: 'Messaging' },
];

export default function WorkflowAutomations() {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const { user } = useAuth();
  
  console.log("WorkflowAutomations component rendered");

  useEffect(() => {
    loadAutomations();
  }, []);

  const loadAutomations = async () => {
    setIsLoading(true);
    try {
      // In a real application, we would fetch this from a backend
      // For now, using mockData
      const mockData: Automation[] = [
        {
          id: 1,
          title: 'New Job Alert',
          description: 'Send notifications when jobs are created',
          isActive: true,
          triggers: ['New job created'],
          actions: ['Send notification'],
          category: 'team'
        },
        {
          id: 2,
          title: 'Quote Follow-up',
          description: 'Follow up on quotes after 3 days',
          isActive: true,
          triggers: ['Quote age > 3 days'],
          actions: ['Send email'],
          category: 'sales'
        },
        {
          id: 3,
          title: 'Customer Feedback Form',
          description: 'Send feedback forms after job completion',
          isActive: true,
          triggers: ['Job marked complete'],
          actions: ['Send form to customer'],
          category: 'forms'
        },
        {
          id: 4,
          title: 'Social Media Post',
          description: 'Post job completion to social media',
          isActive: true,
          triggers: ['Job marked complete'],
          actions: ['Post to social media'],
          category: 'social',
          premium: true
        },
        {
          id: 5,
          title: 'SMS Appointment Reminder',
          description: 'Send SMS reminder 24 hours before appointment',
          isActive: true,
          triggers: ['24h before appointment'],
          actions: ['Send SMS'],
          category: 'messaging',
          premium: true
        },
        {
          id: 6,
          title: 'Customer Milestone Email',
          description: 'Send anniversary email to customers',
          isActive: false,
          triggers: ['Customer anniversary'],
          actions: ['Send email'],
          category: 'sales'
        },
        {
          id: 7,
          title: 'Document Expiry Alert',
          description: 'Alert when important documents are about to expire',
          isActive: false,
          triggers: ['Document expiry < 7 days'],
          actions: ['Send notification'],
          category: 'team'
        },
        {
          id: 8,
          title: 'Team Task Assignments',
          description: 'Automatically assign tasks based on team roles',
          isActive: false,
          triggers: ['New task created'],
          actions: ['Assign to team member'],
          category: 'team'
        }
      ];
      
      setAutomations(mockData);
    } catch (error) {
      console.error("Failed to load automations:", error);
      toast.error("Failed to load automations");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutomation = async (id: number, currentValue: boolean) => {
    try {
      // In a real application, we would update this via a backend service
      // For now, just update the local state
      setAutomations(prevAutomations => {
        return prevAutomations.map(automation => {
          if (automation.id === id) {
            return { ...automation, isActive: !currentValue };
          }
          return automation;
        });
      });
      
      toast.success(`Automation ${currentValue ? 'disabled' : 'enabled'}`);
    } catch (error) {
      console.error("Failed to toggle automation:", error);
      toast.error("Failed to toggle automation");
    }
  };

  const navigateToWorkflow = (automationId?: number) => {
    if (automationId) {
      navigate(`/workflow?automationId=${automationId}`);
    } else {
      navigate('/workflow');
    }
  };

  const addToWorkflow = (automationId: number) => {
    navigateToWorkflow(automationId);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'team':
        return <Users className="h-4 w-4" />;
      case 'sales':
        return <Briefcase className="h-4 w-4" />;
      case 'forms':
        return <FileText className="h-4 w-4" />;
      case 'social':
        return <ArrowRightLeft className="h-4 w-4" />;
      case 'calendar':
        return <Calendar className="h-4 w-4" />;
      case 'messaging':
        return <Mail className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  const filteredAutomations = activeTab === 'all' 
    ? automations 
    : automations.filter(automation => automation.category === activeTab);

  return (
    <AppLayout>
      <div className="container px-4 py-6 mx-auto max-w-7xl">
        <WorkflowNavigation />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Automations</h1>
            <p className="mt-2 text-sm text-gray-500">Manage your workflow automations and triggers</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button onClick={() => navigateToWorkflow()}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Automation
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            {AUTOMATION_CATEGORIES.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                <p>Loading automations...</p>
              ) : filteredAutomations.length > 0 ? (
                filteredAutomations.map(automation => (
                  <Card key={automation.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg ${
                            automation.isActive ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <Zap className={`h-5 w-5 ${
                              automation.isActive ? 'text-green-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {automation.title}
                              {automation.premium && (
                                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 hover:bg-blue-100">
                                  Premium
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {automation.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="my-4 space-y-3">
                        <div className="flex flex-col">
                          <h4 className="text-sm font-medium mb-2">Triggers:</h4>
                          <ul className="text-sm space-y-1">
                            {automation.triggers.map((trigger, idx) => (
                              <li key={idx} className="flex items-center text-gray-600">
                                <Check className="h-3 w-3 mr-2 text-green-500" />
                                {trigger}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col">
                          <h4 className="text-sm font-medium mb-2">Actions:</h4>
                          <ul className="text-sm space-y-1">
                            {automation.actions.map((action, idx) => (
                              <li key={idx} className="flex items-center text-gray-600">
                                <Check className="h-3 w-3 mr-2 text-blue-500" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id={`automation-switch-${automation.id}`}
                            checked={automation.isActive}
                            onCheckedChange={() => toggleAutomation(automation.id, automation.isActive)}
                          />
                          <Label htmlFor={`automation-switch-${automation.id}`}>
                            {automation.isActive ? 'Active' : 'Inactive'}
                          </Label>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => addToWorkflow(automation.id)}
                        >
                          Add to Workflow
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                  <Zap className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium">No automations found</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTab === 'all' 
                      ? "You don't have any automations yet" 
                      : `You don't have any ${AUTOMATION_CATEGORIES.find(c => c.id === activeTab)?.label.toLowerCase()} automations yet`}
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigateToWorkflow()}
                  >
                    <Plus className="h-4 w-4 mr-2" /> 
                    Create Your First Automation
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
} 