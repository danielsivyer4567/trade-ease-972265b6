
import React, { useState, Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WorkflowSaveDialogProps {
  open: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  onSave: (name: string, description: string, category: string) => void;
  initialName?: string;
  initialDescription?: string;
  initialCategory?: string;
  title?: string;
  isLoading?: boolean;
}

export const WorkflowSaveDialog: React.FC<WorkflowSaveDialogProps> = ({
  open,
  onClose,
  onOpenChange,
  onSave,
  initialName = '',
  initialDescription = '',
  initialCategory = '',
  title = 'Save Workflow',
  isLoading = false
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState(initialCategory);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name, description, category);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Workflow name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select 
              value={category} 
              onValueChange={setCategory}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Financial">Financial</SelectItem>
                <SelectItem value="Quality">Quality</SelectItem>
                <SelectItem value="Efficiency">Efficiency</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              placeholder="Workflow description"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave} disabled={!name.trim() || isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
