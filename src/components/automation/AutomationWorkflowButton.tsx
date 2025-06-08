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
      
      // Navigate directly with state
      navigate(`/workflow`, { 
        state: { 
          addAutomation: true,
          automationId,
          automationTitle: automationTitle || `Automation ${automationId}`,
          automationDescription: automationDescription || '',
          preserveExisting: true
        } 
      });
      
      toast.success(`Adding automation to workflow builder`);
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
