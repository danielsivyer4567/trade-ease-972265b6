
import React from 'react';
import { Button } from "@/components/ui/button";
import { Workflow, FolderOpen, Key, ArrowRightLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AutomationSelector } from './AutomationSelector';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GCPVisionForm } from "@/components/messaging/dialog-sections/GCPVisionForm";

interface WorkflowControlsProps {
  handleNavigateToAutomations: () => void;
  handleSaveWorkflow: () => void;
  handleSendToFinancials: () => void;
  handleAddAutomation: (automationNode: any) => void;
  setLoadDialogOpen: (open: boolean) => void;
  setGcpVisionKeyDialogOpen: (open: boolean) => void;
  gcpVisionKeyDialogOpen: boolean;
  gcpVisionKey: string;
  setGcpVisionKey: (key: string) => void;
  integrationStatus: string;
  targetData: {
    targetType?: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';
    targetId?: string;
    createAutomationNode?: boolean;
  } | null;
  isUserLoggedIn: boolean;
}

export const WorkflowControls: React.FC<WorkflowControlsProps> = ({
  handleNavigateToAutomations,
  handleSaveWorkflow,
  handleSendToFinancials,
  handleAddAutomation,
  setLoadDialogOpen,
  setGcpVisionKeyDialogOpen,
  gcpVisionKeyDialogOpen,
  gcpVisionKey,
  setGcpVisionKey,
  integrationStatus,
  targetData,
  isUserLoggedIn
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2"
        onClick={handleNavigateToAutomations}
      >
        <Workflow className="h-4 w-4" />
        <span className="hidden sm:inline">Manage Automations</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setLoadDialogOpen(true)}
      >
        <FolderOpen className="h-4 w-4" />
        <span className="hidden sm:inline">Load</span>
      </Button>
      
      <AutomationSelector 
        onSelectAutomation={handleAddAutomation} 
        targetType={targetData?.targetType}
        targetId={targetData?.targetId}
      />
      
      <Dialog open={gcpVisionKeyDialogOpen} onOpenChange={setGcpVisionKeyDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Key className="h-4 w-4" /> 
            <span className="hidden sm:inline">GCP Key</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-slate-200">
          <DialogHeader>
            <DialogTitle>Google Cloud Vision API Configuration</DialogTitle>
            <DialogDescription>
              Enter your Google Cloud Vision API key to enable document text extraction and image analysis.
              <p className="mt-2 text-xs text-muted-foreground">
                This key will be securely stored in your Supabase database.
              </p>
            </DialogDescription>
          </DialogHeader>
          <GCPVisionForm gcpVisionKey={gcpVisionKey} setGcpVisionKey={setGcpVisionKey} />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setGcpVisionKeyDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Button 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2"
        disabled={integrationStatus !== 'ready'}
        onClick={handleSendToFinancials}
      >
        <ArrowRightLeft className="h-4 w-4" /> 
        <span className="hidden sm:inline">Vision to Financials</span>
      </Button>
      
      <Button 
        onClick={handleSaveWorkflow}
        size="sm" 
        className="flex items-center gap-2"
        disabled={!isUserLoggedIn}
      >
        <Save className="h-4 w-4" /> Save
      </Button>
    </div>
  );
};
