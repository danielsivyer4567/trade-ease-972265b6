
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Workflow } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AutomationWorkflowButtonProps extends ButtonProps {
  automationId?: number;
}

export function AutomationWorkflowButton({ automationId, children, ...props }: AutomationWorkflowButtonProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (automationId) {
      navigate(`/workflow?automationId=${automationId}`);
    } else {
      navigate('/workflow');
    }
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={handleClick}
      {...props}
    >
      <Workflow className="h-4 w-4" />
      {children || <span>Open in Workflow Builder</span>}
    </Button>
  );
}
