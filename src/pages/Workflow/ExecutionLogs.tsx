import React from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkflowNavigation } from './components/WorkflowNavigation';
import { useWorkflowDarkMode, DARK_BG, DARK_TEXT, DARK_GOLD, DARK_SECONDARY } from '@/contexts/WorkflowDarkModeContext';

export default function ExecutionLogs() {
  const { darkMode: workflowDarkMode } = useWorkflowDarkMode();
  
  return (
    <BaseLayout>
      <div className={`p-4 md:p-6 space-y-4 md:space-y-6 ${workflowDarkMode ? 'bg-[#18140c]' : ''}`}>
        <WorkflowNavigation workflowDarkMode={workflowDarkMode} />
        
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${workflowDarkMode ? 'text-[#ffe082]' : ''}`}>
            <Activity className={`h-6 w-6 ${workflowDarkMode ? 'text-[#bfa14a]' : 'text-blue-600'}`} />
            Workflow Execution Logs
          </h1>
          <p className={`mt-1 ${workflowDarkMode ? 'text-[#ffe082] opacity-80' : 'text-muted-foreground'}`}>
            Track the execution history of your workflow automations
          </p>
        </div>

        <div className="space-y-4">
          {/* Example log entries */}
          {[1, 2, 3].map((i) => (
            <Card key={i} className={workflowDarkMode ? 'bg-[#211c15] border-[#bfa14a]' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`text-lg ${workflowDarkMode ? 'text-[#bfa14a]' : ''}`}>
                    Customer Onboarding Workflow
                  </CardTitle>
                  <Badge variant={i === 1 ? "default" : "outline"} className={
                    workflowDarkMode ? (
                      i === 1 ? 'bg-[#bfa14a] text-[#18140c]' : 'border-[#bfa14a] text-[#ffe082]'
                    ) : ''
                  }>
                    {i === 1 ? 'Running' : 'Completed'}
                  </Badge>
                </div>
                <CardDescription className={workflowDarkMode ? 'text-[#ffe082] opacity-70' : ''}>
                  Execution #{1000 + i} • Started 2 hours ago
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className={`flex items-center gap-2 text-sm ${workflowDarkMode ? 'text-[#ffe082]' : ''}`}>
                    <span className={`h-2 w-2 rounded-full ${i === 1 ? (workflowDarkMode ? 'bg-[#bfa14a]' : 'bg-green-500') : (workflowDarkMode ? 'bg-[#bfa14a]' : 'bg-blue-500')}`}></span>
                    {i === 1 ? 'Processing customer data...' : 'Workflow completed successfully'}
                  </div>
                  <div className={`text-xs ${workflowDarkMode ? 'text-[#ffe082] opacity-60' : 'text-gray-500'}`}>
                    Duration: {i === 1 ? '2m 15s' : '5m 32s'} • Nodes executed: {i === 1 ? '3/5' : '5/5'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className={`text-center p-10 border border-dashed rounded-md ${workflowDarkMode ? 'border-[#bfa14a]' : ''}`}>
          <p className={workflowDarkMode ? 'text-[#ffe082] opacity-80' : 'text-muted-foreground'}>
            More execution logs will appear here as your workflows run
          </p>
        </div>
      </div>
    </BaseLayout>
  );
} 