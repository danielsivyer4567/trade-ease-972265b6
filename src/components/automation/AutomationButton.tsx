import React, { useState, useEffect, useCallback } from 'react';
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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Memoize loadAutomations to prevent recreation on every render
  const loadAutomations = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Loading automations for ${targetType}:${targetId}`);
      const response = await AutomationIntegrationService.getAssociatedAutomations(targetType, targetId);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load automations');
      }
      
      console.log('Loaded automations:', response.automations);
      setAutomations(response.automations || []);
      setHasInitiallyLoaded(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load automations';
      console.error('Failed to load automations:', errorMessage);
      setError(errorMessage);
      
      // Only show toast for user interaction, not initial load
      if (hasInitiallyLoaded) {
        toast.error('Failed to load automations');
      }
    } finally {
      setIsLoading(false);
    }
  }, [targetType, targetId, isLoading, hasInitiallyLoaded]);
  
  // Pre-load automations on component mount
  useEffect(() => {
    if (targetId && targetType) {
      loadAutomations();
    }
  }, [targetId, targetType, loadAutomations]);
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && (!hasInitiallyLoaded || automations.length === 0 || error)) {
      loadAutomations();
    }
  };
  
  const handleTriggerAutomation = async (automationId: number) => {
    setLoadingAutomationId(automationId);
    try {
      console.log(`Triggering automation ${automationId}`);
      const result = await AutomationIntegrationService.triggerAutomation(automationId, {
        targetType,
        targetId
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to trigger automation');
      }
      
      toast.success('Automation triggered successfully');
      setIsOpen(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to trigger automation';
      console.error('Failed to trigger automation:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoadingAutomationId(null);
    }
  };
  
  const navigateToWorkflow = () => {
    try {
      console.log('Navigating to workflow page');
      navigate('/workflow', { 
        state: { 
          targetType, 
          targetId,
          createAutomationNode: true
        } 
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to navigate to workflow:', error);
      toast.error('Failed to navigate to workflow page');
    }
  };

  // Force popover closed when error occurs
  useEffect(() => {
    if (error && isOpen) {
      setIsOpen(false);
    }
  }, [error, isOpen]);

  // If the button is in an error state, just reset it on click
  const handleButtonClick = () => {
    if (error) {
      setError(null);
      loadAutomations();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={fullWidth ? "w-full" : ""}
          disabled={isLoading && !hasInitiallyLoaded}
          onClick={handleButtonClick}
        >
          {isLoading && !hasInitiallyLoaded ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : error ? (
            <span className="h-4 w-4 mr-2 text-red-500">!</span>
          ) : (
            <Workflow className="h-4 w-4 mr-2" />
          )}
          {buttonText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        <div className="space-y-2">
          <h4 className="text-sm font-medium p-2">Associated Automations</h4>
          
          {isLoading && hasInitiallyLoaded ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : error ? (
            <div className="p-2 text-sm text-red-500">
              Failed to load: {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => loadAutomations()}
              >
                Retry
              </Button>
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
