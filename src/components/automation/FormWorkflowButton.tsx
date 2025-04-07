
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { Workflow } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface FormWorkflowButtonProps extends ButtonProps {
  formId?: number;
  targetType?: string; // Added for WorkflowTest compatibility
  targetId?: string;   // Added for WorkflowTest compatibility
  entityType?: string; // Alternative naming
  entityId?: string;   // Alternative naming
  label?: string;      // Added for WorkflowTest compatibility
}

export function FormWorkflowButton({ 
  formId, 
  children, 
  label,
  targetType,
  targetId,
  entityType,
  entityId,
  ...props 
}: FormWorkflowButtonProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    const params = new URLSearchParams();
    
    if (formId) {
      params.append('formId', formId.toString());
    }
    
    // Support for both naming conventions
    const type = targetType || entityType;
    const id = targetId || entityId;
    
    if (type) {
      params.append('targetType', type);
    }
    
    if (id) {
      params.append('targetId', id);
    }
    
    const queryString = params.toString();
    navigate(`/automations?category=forms${queryString ? '&' + queryString : ''}`);
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
