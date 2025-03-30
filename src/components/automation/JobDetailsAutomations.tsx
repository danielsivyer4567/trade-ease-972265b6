
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Workflow, MessageSquare, Calendar, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AutomationButton } from './AutomationButton';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';
import { toast } from 'sonner';

interface JobDetailsAutomationsProps {
  jobId: string;
  jobStage: string;
}

export function JobDetailsAutomations({ jobId, jobStage }: JobDetailsAutomationsProps) {
  const navigate = useNavigate();
  
  const handleCreateWorkflow = () => {
    navigate('/workflow', { 
      state: { 
        targetType: 'job', 
        targetId: jobId 
      } 
    });
  };
  
  const triggerSpecificAutomation = async (automationId: number) => {
    try {
      await AutomationIntegrationService.triggerAutomation(automationId, {
        targetType: 'job',
        targetId: jobId,
        additionalData: {
          jobStage
        }
      });
      
      toast.success('Automation triggered successfully');
    } catch (error) {
      console.error('Failed to trigger automation:', error);
      toast.error('Failed to trigger automation');
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Workflow className="h-5 w-5 text-blue-600" />
          Job Automations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Streamline your workflow by connecting automations to this job.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => triggerSpecificAutomation(5)}
            >
              <MessageSquare className="h-4 w-4 text-blue-500" />
              Send SMS Update
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => triggerSpecificAutomation(2)}
            >
              <CreditCard className="h-4 w-4 text-green-500" />
              Send Quote Follow-up
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => triggerSpecificAutomation(1)}
            >
              <Calendar className="h-4 w-4 text-orange-500" />
              Send Job Reminder
            </Button>
          </div>
          
          <div className="flex justify-between pt-3">
            <AutomationButton 
              targetType="job"
              targetId={jobId}
              buttonText="Manage Automations"
            />
            
            <Button 
              variant="default" 
              onClick={handleCreateWorkflow}
            >
              <Workflow className="h-4 w-4 mr-2" />
              Create Custom Workflow
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
