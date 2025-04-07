
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Flow } from './components/Flow';
import { NodeSidebar } from './components/NodeSidebar';
import { WorkflowNavigation } from './components/WorkflowNavigation';
import { WorkflowHeader } from './components/WorkflowHeader';
import { WorkflowStatusCards } from './components/WorkflowStatusCards';
import { WorkflowSaveDialog } from './components/WorkflowSaveDialog';
import { WorkflowLoadDialog } from './components/WorkflowLoadDialog';
import { useWorkflowEditor } from './hooks/useWorkflowEditor';

export default function WorkflowPage() {
  const {
    flowInstance,
    setFlowInstance,
    gcpVisionKeyDialogOpen,
    setGcpVisionKeyDialogOpen,
    gcpVisionKey,
    setGcpVisionKey,
    hasGcpVisionKey,
    isLoadingKey,
    integrationStatus,
    saveDialogOpen,
    setSaveDialogOpen,
    loadDialogOpen,
    setLoadDialogOpen,
    isSaving,
    currentWorkflowId,
    workflowName,
    workflowDescription,
    workflowCategory,
    targetData,
    handleSaveWorkflow,
    handleSaveConfirm,
    handleLoadWorkflow,
    handleSendToFinancials,
    handleAddAutomation,
    handleNavigateToAutomations,
    isUserLoggedIn
  } = useWorkflowEditor();

  return (
    <AppLayout>
      <div className="p-4 h-full">
        <WorkflowNavigation />
        
        <WorkflowHeader 
          workflowName={workflowName}
          handleNavigateToAutomations={handleNavigateToAutomations}
          handleSaveWorkflow={handleSaveWorkflow}
          handleSendToFinancials={handleSendToFinancials}
          handleAddAutomation={handleAddAutomation}
          setLoadDialogOpen={setLoadDialogOpen}
          setGcpVisionKeyDialogOpen={setGcpVisionKeyDialogOpen}
          gcpVisionKeyDialogOpen={gcpVisionKeyDialogOpen}
          gcpVisionKey={gcpVisionKey}
          setGcpVisionKey={setGcpVisionKey}
          integrationStatus={integrationStatus}
          targetData={targetData}
          isUserLoggedIn={isUserLoggedIn}
        />

        <div className="flex h-[calc(100vh-200px)] border border-gray-200 rounded-lg overflow-hidden">
          <NodeSidebar targetData={targetData} />
          <div className="flex-1 relative">
            <Flow onInit={setFlowInstance} workflowId={currentWorkflowId} initialData={initialFlowData} />
          </div>
        </div>

        <WorkflowStatusCards 
          hasGcpVisionKey={hasGcpVisionKey} 
          isLoadingKey={isLoadingKey} 
        />
        
        <WorkflowSaveDialog 
          open={saveDialogOpen}
          onOpenChange={setSaveDialogOpen}
          onSave={handleSaveConfirm}
          isLoading={isSaving}
          initialName={workflowName}
          initialDescription={workflowDescription}
          initialCategory={workflowCategory}
        />
        
        <WorkflowLoadDialog 
          open={loadDialogOpen}
          onOpenChange={setLoadDialogOpen}
          onLoad={handleLoadWorkflow}
        />
      </div>
    </AppLayout>
  );
}
