
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Workflow } from 'lucide-react';

interface AutomationWorkflowButtonProps {
  automationId?: number; // Made optional
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
  children?: React.ReactNode;
  workflowId?: string; // Added workflowId prop
}

export function AutomationWorkflowButton({ 
  automationId, 
  variant = 'default', 
  size = 'default',
  children = 'Add to Workflow',
  workflowId
}: AutomationWorkflowButtonProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    let path = '/workflow';
    const params = new URLSearchParams();
    
    if (automationId) {
      params.append('automationId', automationId.toString());
    }
    
    if (workflowId) {
      params.append('id', workflowId);
    }
    
    const queryString = params.toString();
    if (queryString) {
      path += `?${queryString}`;
    }
    
    navigate(path);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className="whitespace-nowrap"
    >
      <Workflow className="h-4 w-4 mr-2" />
      {children}
    </Button>
  );
}
