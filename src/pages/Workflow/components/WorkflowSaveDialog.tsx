import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

interface WorkflowSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flowInstance: any;
}

export function WorkflowSaveDialog({
  open,
  onOpenChange,
  flowInstance,
}: WorkflowSaveDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name) {
      toast.error('Please enter a name for your workflow');
      return;
    }

    if (!flowInstance) {
      toast.error('No workflow to save');
      return;
    }

    setIsSaving(true);
    try {
      const flow = flowInstance.toObject();
      // Here you would typically save to your backend
      // For now, we'll save to localStorage
      const workflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      const newWorkflow = {
        id: Date.now().toString(),
        name,
        description,
        flow,
        createdAt: new Date().toISOString(),
      };
      workflows.push(newWorkflow);
      localStorage.setItem('workflows', JSON.stringify(workflows));
      
      toast.success('Workflow saved successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast.error('Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Workflow</DialogTitle>
          <DialogDescription>
            Give your workflow a name and description to save it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter workflow name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter workflow description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Workflow'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
