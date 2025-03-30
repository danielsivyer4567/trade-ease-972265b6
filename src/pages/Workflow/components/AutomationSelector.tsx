
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Workflow, Search, Plus, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';

interface AutomationSelectorProps {
  onSelectAutomation: (automationNode: any) => void;
  targetType?: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';
  targetId?: string;
}

export function AutomationSelector({ 
  onSelectAutomation,
  targetType,
  targetId
}: AutomationSelectorProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [automations, setAutomations] = useState([]);
  const [associatedAutomations, setAssociatedAutomations] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Fetch automations (this is mock data, but would come from your actual automations storage)
  useEffect(() => {
    // For this example, we're using dummy data
    // In a real implementation, you'd fetch from your database
    const mockAutomations = [
      {
        id: 1,
        title: 'New Job Alert',
        description: 'Send notifications when jobs are created',
        isActive: true,
        triggers: ['New job created'],
        actions: ['Send notification'],
        category: 'team'
      },
      {
        id: 2,
        title: 'Quote Follow-up',
        description: 'Follow up on quotes after 3 days',
        isActive: true,
        triggers: ['Quote age > 3 days'],
        actions: ['Send email'],
        category: 'sales'
      },
      {
        id: 3,
        title: 'Customer Feedback Form',
        description: 'Send feedback forms after job completion',
        isActive: true,
        triggers: ['Job marked complete'],
        actions: ['Send form to customer'],
        category: 'forms'
      },
      {
        id: 4,
        title: 'Social Media Post',
        description: 'Post job completion to social media',
        isActive: true,
        triggers: ['Job marked complete'],
        actions: ['Post to social media'],
        category: 'social',
        premium: true
      },
      {
        id: 5,
        title: 'SMS Appointment Reminder',
        description: 'Send SMS reminder 24 hours before appointment',
        isActive: true,
        triggers: ['24h before appointment'],
        actions: ['Send SMS'],
        category: 'messaging',
        premium: true
      }
    ];
    
    setAutomations(mockAutomations);
    
    // If we have a target, load any associated automations
    if (targetType && targetId) {
      loadAssociatedAutomations();
    }
  }, [targetType, targetId]);
  
  const loadAssociatedAutomations = async () => {
    if (!targetType || !targetId) return;
    
    setIsLoading(true);
    try {
      const { success, automations } = await AutomationIntegrationService.getAssociatedAutomations(
        targetType,
        targetId
      );
      
      if (success && automations) {
        setAssociatedAutomations(automations.map(a => a.id));
      }
    } catch (error) {
      console.error('Failed to load associated automations:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter automations based on search query
  const filteredAutomations = searchQuery 
    ? automations.filter(auto => 
        auto.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        auto.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : automations;
    
  const handleSelectAutomation = (automation) => {
    onSelectAutomation({
      type: 'automationNode',
      position: { x: 100, y: 100 },
      data: {
        label: automation.title,
        description: automation.description,
        triggers: automation.triggers,
        actions: automation.actions,
        automationId: automation.id,
        premium: automation.premium,
      }
    });
    
    // If we have target data, associate this automation with the target
    if (targetType && targetId) {
      AutomationIntegrationService.associateAutomation(automation.id, targetType, targetId);
    }
    
    setDialogOpen(false);
  };
  
  const navigateToAutomations = () => {
    navigate('/automations');
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center">
          <Workflow className="h-4 w-4" />
          Add Automation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Automation</DialogTitle>
          <DialogDescription>
            Choose an existing automation to add to your workflow.
            {targetType && targetId && (
              <Badge variant="outline" className="ml-2 bg-blue-50">
                <Tag className="h-3 w-3 mr-1" />
                {targetType}: {targetId.substring(0, 8)}
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-2 my-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search automations..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={navigateToAutomations}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {isLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : filteredAutomations.length === 0 ? (
            <div className="text-center py-4 text-sm text-gray-500">
              No automations found
            </div>
          ) : (
            filteredAutomations.map(automation => (
              <div 
                key={automation.id}
                className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectAutomation(automation)}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium flex items-center">
                    <Workflow className="h-4 w-4 text-blue-500 mr-1.5" />
                    {automation.title}
                    {associatedAutomations.includes(automation.id) && (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-600 border-green-200">
                        Associated
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {automation.premium && (
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                        <span className="mr-1">✨</span> Pro
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {automation.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{automation.description}</div>
              </div>
            ))
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
