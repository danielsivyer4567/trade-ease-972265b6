import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AutomationWorkflowButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  automationId?: number;
  children?: React.ReactNode;
}

export function AutomationWorkflowButton({
  variant = 'default',
  size = 'default',
  className = '',
  automationId,
  children
}: AutomationWorkflowButtonProps) {
  const navigate = useNavigate();

  const handleNavigateToAutomations = () => {
    if (automationId) {
      console.log('AutomationWorkflowButton: navigating to workflow with automation', automationId, 'preserveExisting: true');
      
      // Route to workflow with automation data
      navigate(`/workflow`, { 
        state: { 
          addAutomation: true,
          automationId: automationId,
          preserveExisting: true // Explicitly set to true to ensure it's preserved
        } 
      });
    } else {
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
