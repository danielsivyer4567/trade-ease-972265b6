
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Workflow } from 'lucide-react';

export interface AutomationWorkflowButtonProps {
  automationId?: number;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'xl' | 'icon';
  children?: React.ReactNode;
  workflowId?: string;
  category?: string;
  targetType?: string; // Added for WorkflowTest compatibility
  targetId?: string;   // Added for WorkflowTest compatibility
  label?: string;      // Added for WorkflowTest compatibility
}

export function AutomationWorkflowButton({ 
  automationId, 
  variant = 'default', 
  size = 'default',
  children,
  workflowId,
  category,
  label
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
    
    if (category) {
      params.append('category', category);
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
      {label || children || 'Add to Workflow'}
    </Button>
  );
}
