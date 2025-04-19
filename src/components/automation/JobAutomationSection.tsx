import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Workflow, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';
import { useNavigate } from 'react-router-dom';
import { Automation } from '@/pages/Automations/types';

interface JobAutomationSectionProps {
  jobId: string;
}

export function JobAutomationSection({ jobId }: JobAutomationSectionProps) {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadAutomations();
  }, [jobId]);
  
  const loadAutomations = async () => {
    setIsLoading(true);
    try {
      const { success, automations, error } = await AutomationIntegrationService.getAssociatedAutomations('job', jobId);
      
      if (!success) {
        throw new Error(error);
      }
      
      setAutomations(automations || []);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load automations';
      console.error('Failed to load automations:', errorMessage);
      toast.error('Failed to load automations');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTriggerAutomation = async (automationId: number) => {
    setIsLoading(true);
    try {
      await AutomationIntegrationService.triggerAutomation(automationId, {
        targetType: 'job',
        targetId: jobId
      });
      toast.success('Automation triggered successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to trigger automation';
      console.error('Failed to trigger automation:', errorMessage);
      toast.error('Failed to trigger automation');
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToWorkflow = () => {
    navigate('/workflow', { 
      state: { 
        targetType: 'job', 
        targetId: jobId,
        createAutomationNode: true
      } 
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Workflow className="h-5 w-5 text-blue-600" />
          Job Automations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {automations.length > 0 ? (
              <div className="space-y-2">
                {automations.map(automation => (
                  <div 
                    key={automation.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer"
                    onClick={() => handleTriggerAutomation(automation.id)}
                  >
                    <div>
                      <p className="font-medium">{automation.title}</p>
                      <p className="text-sm text-gray-500">{automation.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No automations configured</p>
                <p className="text-sm text-gray-400">Add automations to streamline your workflow</p>
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={navigateToWorkflow}
            >
              <Plus className="h-4 w-4 mr-2" />
              Configure Job Automations
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
