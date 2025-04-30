import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';

interface WorkflowAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateWorkflow: (prompt: string) => void;
}

export function WorkflowAIModal({ isOpen, onClose, onGenerateWorkflow }: WorkflowAIModalProps) {
  const [prompt, setPrompt] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateWorkflow(prompt);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Workflow AI Assistant
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Describe your workflow needs and let AI generate a customized workflow for you.
            </p>
            <Input
              placeholder="e.g., Create a workflow for managing residential construction projects..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-24 resize-none"
              multiline
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!prompt.trim()}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Workflow
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 