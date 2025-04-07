
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Workflow } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface FormWorkflowButtonProps extends ButtonProps {
  formId?: number;
  targetType?: string; // Added for WorkflowTest compatibility
  targetId?: string;   // Added for WorkflowTest compatibility
  label?: string;      // Added for WorkflowTest compatibility
}

export function FormWorkflowButton({ 
  formId, 
  children, 
  label,
  ...props 
}: FormWorkflowButtonProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (formId) {
      navigate(`/automations?category=forms&formId=${formId}`);
    } else {
      navigate('/automations?category=forms');
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
      {label || children || <span>Manage Automations</span>}
    </Button>
  );
}
