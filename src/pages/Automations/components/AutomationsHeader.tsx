import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Workflow, ClipboardList, ArrowLeft } from 'lucide-react';
import { AutomationWorkflowButton } from '@/components/automation/AutomationWorkflowButton';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface Automation {
  id: number;
  title: string;
  description: string;
  category: string;
  trigger: string;
  action: string;
  createdAt: string;
  updatedAt: string;
}

interface AutomationsHeaderProps {
  selectedCategory: string;
  onAutomationCreated?: (automation: Automation) => void;
}

const AutomationsHeader = ({ selectedCategory, onAutomationCreated }: AutomationsHeaderProps) => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    title: '',
    description: '',
    category: selectedCategory,
    trigger: '',
    action: ''
  });

  const navigateToForms = () => {
    navigate('/forms');
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleCreateAutomation = () => {
    setIsCreateDialogOpen(true);
  };

  const handleSubmit = () => {
    // Here you would typically make an API call to create the automation
    const automation = {
      id: Date.now(), // Temporary ID
      ...newAutomation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (onAutomationCreated) {
      onAutomationCreated(automation);
    }
    
    setIsCreateDialogOpen(false);
    setNewAutomation({
      title: '',
      description: '',
      category: selectedCategory,
      trigger: '',
      action: ''
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Workflow className="mr-2 h-6 w-6" />
            Trade Automations
          </h1>
          <p className="text-muted-foreground mt-1">
            Powerful automation workflows designed specifically for trade businesses
          </p>
        </div>
        <div className="flex gap-2">
          {selectedCategory === 'forms' && (
            <Button variant="outline" className="flex items-center gap-2" onClick={navigateToForms}>
              <ClipboardList className="h-4 w-4" />
              <span>Manage Forms</span>
            </Button>
          )}
          <AutomationWorkflowButton variant="outline" />
          <Button 
            className="flex items-center gap-2"
            onClick={handleCreateAutomation}
          >
            <Plus className="h-4 w-4" />
            <span>Create Automation</span>
          </Button>
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Automation</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newAutomation.title}
                onChange={(e) => setNewAutomation({ ...newAutomation, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newAutomation.description}
                onChange={(e) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select
                value={newAutomation.category}
                onValueChange={(value) => setNewAutomation({ ...newAutomation, category: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory">Inventory Management</SelectItem>
                  <SelectItem value="customer">Customer Relations</SelectItem>
                  <SelectItem value="team">Team Performance</SelectItem>
                  <SelectItem value="forms">Forms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="trigger" className="text-right">
                Trigger
              </Label>
              <Select
                value={newAutomation.trigger}
                onValueChange={(value) => setNewAutomation({ ...newAutomation, trigger: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_order">New Order</SelectItem>
                  <SelectItem value="low_stock">Low Stock Alert</SelectItem>
                  <SelectItem value="customer_message">Customer Message</SelectItem>
                  <SelectItem value="form_submission">Form Submission</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="action" className="text-right">
                Action
              </Label>
              <Select
                value={newAutomation.action}
                onValueChange={(value) => setNewAutomation({ ...newAutomation, action: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="send_email">Send Email</SelectItem>
                  <SelectItem value="create_task">Create Task</SelectItem>
                  <SelectItem value="update_inventory">Update Inventory</SelectItem>
                  <SelectItem value="notify_team">Notify Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Automation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutomationsHeader;
