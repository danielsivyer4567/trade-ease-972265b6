import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Zap } from 'lucide-react';

interface TriggerSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrigger: (triggerId: string) => void;
}

export function TriggerSelector({ isOpen, onClose, onSelectTrigger }: TriggerSelectorProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const triggers = [
    { id: 'form-submission', name: 'Form Submission', description: 'Trigger when a form is submitted' },
    { id: 'new-customer', name: 'New Customer', description: 'Trigger when a new customer is created' },
    { id: 'job-created', name: 'Job Created', description: 'Trigger when a new job is created' },
    { id: 'quote-approved', name: 'Quote Approved', description: 'Trigger when a quote is approved' },
  ];

  const filteredTriggers = triggers.filter(trigger =>
    trigger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trigger.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Select Workflow Trigger
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search triggers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="space-y-2">
            {filteredTriggers.map((trigger) => (
              <button
                key={trigger.id}
                onClick={() => onSelectTrigger(trigger.id)}
                className="w-full p-3 text-left rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="font-medium">{trigger.name}</div>
                <div className="text-sm text-muted-foreground">{trigger.description}</div>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 