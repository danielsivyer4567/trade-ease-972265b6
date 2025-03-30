
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Workflow } from 'lucide-react';

interface AutomationWorkflowButtonProps {
  automationId?: number; // Made optional
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export function AutomationWorkflowButton({ 
  automationId, 
  variant = 'default', 
  size = 'default',
  children = 'Add to Workflow'
}: AutomationWorkflowButtonProps) {
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
      variant={variant}
      size={size}
      onClick={handleClick}
    >
      <Workflow className="h-4 w-4 mr-2" />
      {children}
    </Button>
  );
}
