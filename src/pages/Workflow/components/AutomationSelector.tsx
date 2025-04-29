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
import { Automation } from '@/pages/Automations/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { AutomationService } from '@/services/AutomationService';

interface AutomationNode {
  type: 'automationNode';
  position: { x: number; y: number };
  data: {
    label: string;
    description: string;
    triggers: string[];
    actions: string[];
    automationId: number;
    premium?: boolean;
  };
}

interface AutomationSelectorProps {
  onSelectAutomation: (automationNode: AutomationNode) => void;
  targetType?: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';
  targetId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AutomationSelector: React.FC<AutomationSelectorProps> = ({ 
  onSelectAutomation,
  targetType,
  targetId,
  open,
  onOpenChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [associatedAutomations, setAssociatedAutomations] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: '',
    description: '',
    type: 'workflow',
  });
  const navigate = useNavigate();
  
  useEffect(() => {
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
  
  const filteredAutomations = searchQuery 
    ? automations.filter(auto => 
        auto.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        auto.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : automations;
    
  const handleSelectAutomation = (automation: Automation) => {
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
    
    if (targetType && targetId) {
      AutomationIntegrationService.associateAutomation(automation.id, targetType, targetId);
    }
    
    onOpenChange(false);
  };
  
  const navigateToAutomations = () => {
    navigate('/automations');
  };

  const handleAddNew = async () => {
    if (!newAutomation.name) {
      toast.error('Please enter a name for the automation');
      return;
    }

    try {
      const result = await AutomationService.create({
        title: newAutomation.name,
        description: newAutomation.description,
        isActive: true,
        triggers: [],
        actions: [],
        category: 'custom',
      });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      toast.success('Automation created successfully');
      setShowAddNew(false);
      setNewAutomation({ name: '', description: '', type: 'workflow' });
      loadAssociatedAutomations();
    } catch (error) {
      toast.error('Failed to create automation');
      console.error('Error creating automation:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => setShowAddNew(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {showAddNew && (
          <div className="border rounded-lg p-4 mb-4 space-y-4">
            <h3 className="font-medium">New Automation</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newAutomation.name}
                onChange={(e) => setNewAutomation(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter automation name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newAutomation.description}
                onChange={(e) => setNewAutomation(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter automation description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddNew(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNew}>
                Create Automation
              </Button>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : filteredAutomations.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            No automations found
          </div>
        ) : (
          <ScrollArea className="h-[400px] w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAutomations.map((automation) => (
                  <TableRow key={automation.id}>
                    <TableCell className="font-medium">
                      {automation.title}
                    </TableCell>
                    <TableCell>
                      {automation.description || 'No description'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectAutomation(automation)}
                      >
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
