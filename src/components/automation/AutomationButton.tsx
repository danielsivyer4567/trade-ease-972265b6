
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Workflow, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface AutomationButtonProps {
  targetType: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar' | string;
  targetId: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  fullWidth?: boolean;
  buttonText?: string;
  label?: string; // Added for WorkflowTest compatibility
}

export function AutomationButton({
  targetType,
  targetId,
  variant = 'outline',
  size = 'sm',
  fullWidth = false,
  buttonText = 'Automations',
  label
}: AutomationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [automations, setAutomations] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const loadAutomations = async () => {
    setIsLoading(true);
    try {
      // Mock API call to get associated automations
      await new Promise(resolve => setTimeout(resolve, 500));
      setAutomations([
        { id: 1, title: 'Send Notification', category: 'notification' },
        { id: 2, title: 'Update Status', category: 'status' }
      ]);
    } catch (error) {
      console.error('Failed to load automations:', error);
      toast.error('Failed to load automations');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      loadAutomations();
    }
  };
  
  const handleTriggerAutomation = async (automationId: number) => {
    setIsLoading(true);
    try {
      // Mock API call to trigger automation
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Automation triggered successfully');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to trigger automation:', error);
      toast.error('Failed to trigger automation');
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToWorkflow = () => {
    navigate('/workflow', { 
      state: { 
        targetType, 
        targetId,
        createAutomationNode: true
      } 
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={fullWidth ? "w-full" : ""}
        >
          <Workflow className="h-4 w-4 mr-2" />
          {label || buttonText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="space-y-2">
          <h4 className="text-sm font-medium p-2">Associated Automations</h4>
          
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : automations.length > 0 ? (
            <div className="space-y-1">
              {automations.map(automation => (
                <div 
                  key={automation.id}
                  className="flex items-center justify-between rounded-md p-2 hover:bg-slate-100 cursor-pointer"
                  onClick={() => handleTriggerAutomation(automation.id)}
                >
                  <span className="text-sm">{automation.title}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {automation.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 p-2">No automations associated</p>
          )}
          
          <div className="border-t pt-2 mt-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full"
              onClick={navigateToWorkflow}
            >
              <Workflow className="h-4 w-4 mr-2" />
              Manage in Workflow
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
