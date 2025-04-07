
import React from 'react';
import { WorkflowControls } from './WorkflowControls';

interface WorkflowHeaderProps {
  workflowName: string;
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

export const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  workflowName,
  ...controlsProps
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">
          {workflowName}
        </h1>
      </div>
      <WorkflowControls {...controlsProps} />
    </div>
  );
};
