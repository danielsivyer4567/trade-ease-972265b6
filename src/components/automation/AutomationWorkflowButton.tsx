import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AutomationWorkflowButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  automationId?: number;
  children?: React.ReactNode;
  automationTitle?: string;
  automationDescription?: string;
}

export function AutomationWorkflowButton({
  variant = 'default',
  size = 'default',
  className = '',
  automationId,
  automationTitle = '',
  automationDescription = '',
  children
}: AutomationWorkflowButtonProps) {
  const navigate = useNavigate();

  const handleNavigateToAutomations = () => {
    if (automationId) {
      console.log('AutomationWorkflowButton: navigating to workflow with automation', automationId, 'preserveExisting: true');
      
      try {
        // Store the automation info in localStorage to avoid message channel errors
        if (window.localStorage) {
          localStorage.setItem('automation_workflow_data', JSON.stringify({
            automationId,
            automationTitle: automationTitle || `Automation ${automationId}`,
            automationDescription: automationDescription || '',
            timestamp: Date.now()
          }));
        }
        
        // Route to workflow with minimal state reference
        navigate(`/workflow`, { 
          state: { 
            addAutomation: true,
            fromLocalStorage: true,
            preserveExisting: true
          } 
        });
        
        toast.success(`Adding automation to workflow builder`);
      } catch (error) {
        console.error('Error navigating to workflow:', error);
        // Fallback to direct state approach if localStorage fails
        navigate(`/workflow`, { 
          state: { 
            addAutomation: true,
            automationId,
            automationTitle: automationTitle || `Automation ${automationId}`,
            automationDescription: automationDescription || '',
            preserveExisting: true
          } 
        });
      }
    } else {
      // If no automationId, just navigate to the automations list
      navigate('/workflow/automations');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
      onClick={handleNavigateToAutomations}
    >
      <Zap className="h-4 w-4" />
      {children || 'Automations'}
    </Button>
  );
}
