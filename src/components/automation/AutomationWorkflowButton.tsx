import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AutomationWorkflowButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  automationId?: number;
}

export function AutomationWorkflowButton({
  variant = 'default',
  size = 'default',
  className = '',
  automationId
}: AutomationWorkflowButtonProps) {
  const navigate = useNavigate();

  const handleNavigateToAutomations = () => {
    if (automationId) {
      navigate(`/workflow?automationId=${automationId}`);
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
      Automations
    </Button>
  );
}
