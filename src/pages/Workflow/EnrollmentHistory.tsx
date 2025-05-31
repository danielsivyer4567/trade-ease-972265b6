import React, { useState } from 'react';
import { WorkflowNavigation } from './components/WorkflowNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, User, Workflow } from 'lucide-react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { useWorkflowDarkMode, DARK_BG, DARK_TEXT, DARK_GOLD, DARK_SECONDARY } from '@/contexts/WorkflowDarkModeContext';

export default function EnrollmentHistory() {
  const { darkMode: workflowDarkMode } = useWorkflowDarkMode();
  const [activeTab, setActiveTab] = useState('all');

  // Mock data for enrollment history
  const enrollments = [
    {
      id: 1,
      workflowName: 'Customer Onboarding',
      entityType: 'Customer',
      entityName: 'John Doe',
      enrolledAt: '2024-03-20T10:30:00',
      status: 'Active',
      completedSteps: 3,
      totalSteps: 5
    },
    {
      id: 2,
      workflowName: 'Quote Approval Process',
      entityType: 'Quote',
      entityName: 'Quote #1234',
      enrolledAt: '2024-03-19T14:20:00',
      status: 'Completed',
      completedSteps: 4,
      totalSteps: 4
    },
    {
      id: 3,
      workflowName: 'Job Scheduling',
      entityType: 'Job',
      entityName: 'Kitchen Renovation',
      enrolledAt: '2024-03-18T09:00:00',
      status: 'Paused',
      completedSteps: 2,
      totalSteps: 6
    }
  ];

  const getStatusColor = (status: string) => {
    if (workflowDarkMode) {
      switch (status.toLowerCase()) {
        case 'active': return 'bg-[#bfa14a] text-[#18140c]';
        case 'completed': return 'bg-green-800 text-green-100';
        case 'paused': return 'bg-yellow-800 text-yellow-100';
        default: return 'bg-gray-700 text-gray-300';
      }
    } else {
      switch (status.toLowerCase()) {
        case 'active': return 'bg-blue-100 text-blue-800';
        case 'completed': return 'bg-green-100 text-green-800';
        case 'paused': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  return (
    <BaseLayout>
      <div className={`p-4 md:p-6 space-y-4 md:space-y-6 ${workflowDarkMode ? 'bg-[#18140c]' : ''}`}>
        <WorkflowNavigation workflowDarkMode={workflowDarkMode} />
        
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${workflowDarkMode ? 'text-[#ffe082]' : ''}`}>
            <Clock className={`h-6 w-6 ${workflowDarkMode ? 'text-[#bfa14a]' : 'text-blue-600'}`} />
            Enrollment History
          </h1>
          <p className={`mt-1 ${workflowDarkMode ? 'text-[#ffe082] opacity-80' : 'text-muted-foreground'}`}>
            Track entities enrolled in workflows and their progress
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className={workflowDarkMode ? 'bg-[#211c15] border-[#bfa14a]' : ''}>
            <TabsTrigger 
              value="all" 
              className={workflowDarkMode ? 'data-[state=active]:bg-[#bfa14a] data-[state=active]:text-[#18140c] text-[#ffe082]' : ''}
            >
              All Enrollments
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className={workflowDarkMode ? 'data-[state=active]:bg-[#bfa14a] data-[state=active]:text-[#18140c] text-[#ffe082]' : ''}
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className={workflowDarkMode ? 'data-[state=active]:bg-[#bfa14a] data-[state=active]:text-[#18140c] text-[#ffe082]' : ''}
            >
              Completed
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id} className={workflowDarkMode ? 'bg-[#211c15] border-[#bfa14a]' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Workflow className={`h-5 w-5 ${workflowDarkMode ? 'text-[#bfa14a]' : 'text-gray-600'}`} />
                      <div>
                        <CardTitle className={`text-lg ${workflowDarkMode ? 'text-[#bfa14a]' : ''}`}>
                          {enrollment.workflowName}
                        </CardTitle>
                        <CardDescription className={workflowDarkMode ? 'text-[#ffe082] opacity-70' : ''}>
                          <span className="flex items-center gap-2 mt-1">
                            <User className="h-3 w-3" />
                            {enrollment.entityType}: {enrollment.entityName}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(enrollment.status)}>
                      {enrollment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className={`text-sm ${workflowDarkMode ? 'text-[#ffe082]' : 'text-gray-600'}`}>
                      Enrolled: {new Date(enrollment.enrolledAt).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex-1 ${workflowDarkMode ? 'bg-[#18140c]' : 'bg-gray-200'} rounded-full h-2`}>
                        <div
                          className={`h-2 rounded-full ${workflowDarkMode ? 'bg-[#bfa14a]' : 'bg-blue-600'}`}
                          style={{ width: `${(enrollment.completedSteps / enrollment.totalSteps) * 100}%` }}
                        />
                      </div>
                      <span className={`text-sm ${workflowDarkMode ? 'text-[#ffe082]' : 'text-gray-600'}`}>
                        {enrollment.completedSteps}/{enrollment.totalSteps} steps
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
} 