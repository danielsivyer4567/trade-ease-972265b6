import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Workflow, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Automation {
  id: number;
  title: string;
  category: string;
}

interface AutomationButtonProps {
  targetType: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';
  targetId: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  fullWidth?: boolean;
  buttonText?: string;
}

export function AutomationButton({
  targetType,
  targetId,
  variant = 'outline',
  size = 'sm',
  fullWidth = false,
  buttonText = 'Automations'
}: AutomationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAutomationId, setLoadingAutomationId] = useState<number | null>(null);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const navigate = useNavigate();
  
  // Pre-load automations on component mount
  useEffect(() => {
    if (targetId && targetType) {
      loadAutomations();
    }
  }, [targetId, targetType]);
  
  const loadAutomations = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { success, automations, error } = await AutomationIntegrationService.getAssociatedAutomations(targetType, targetId);
      
      if (!success) {
        throw new Error(error);
      }
      
      setAutomations(automations || []);
      setHasInitiallyLoaded(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load automations';
      console.error('Failed to load automations:', errorMessage);
      // Only show toast for user interaction, not initial load
      if (hasInitiallyLoaded) {
        toast.error('Failed to load automations');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && (!hasInitiallyLoaded || automations.length === 0)) {
      loadAutomations();
    }
  };
  
  const handleTriggerAutomation = async (automationId: number) => {
    setLoadingAutomationId(automationId);
    try {
      await AutomationIntegrationService.triggerAutomation(automationId, {
        targetType,
        targetId
      });
      toast.success('Automation triggered successfully');
      setIsOpen(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to trigger automation';
      console.error('Failed to trigger automation:', errorMessage);
      toast.error('Failed to trigger automation');
    } finally {
      setLoadingAutomationId(null);
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
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={fullWidth ? "w-full" : ""}
          disabled={isLoading && !hasInitiallyLoaded}
        >
          {isLoading && !hasInitiallyLoaded ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Workflow className="h-4 w-4 mr-2" />
          )}
          {buttonText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="space-y-2">
          <h4 className="text-sm font-medium p-2">Associated Automations</h4>
          
          {isLoading && hasInitiallyLoaded ? (
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
                  {loadingAutomationId === automation.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      {automation.category}
                    </span>
                  )}
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
