
import React, { useRef } from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { useWorkflowEditor } from './hooks/useWorkflowEditor';
import { WorkflowHeader } from './components/WorkflowHeader';
import { Flow, FlowHandle } from './components/Flow';
import { NodeSidebar } from './components/NodeSidebar';
import { WorkflowSaveDialog } from './components/WorkflowSaveDialog';
import { WorkflowLoadDialog } from './components/WorkflowLoadDialog';
import { WorkflowSyncStatus } from './components/WorkflowSyncStatus';

const Workflow = () => {
  const flowRef = useRef<FlowHandle>(null);
  const {
    flowInstance,
    setFlowInstance,
    gcpVisionKeyDialogOpen,
    setGcpVisionKeyDialogOpen,
    gcpVisionKey,
    setGcpVisionKey,
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
    initialFlowData,
    targetData,
    handleSaveWorkflow,
    handleSaveConfirm,
    handleLoadWorkflow,
    handleSendToFinancials,
    handleAddAutomation,
    handleNavigateToAutomations,
    isUserLoggedIn,
    lastSavedAt,
    isSyncing,
    hasUnsavedChanges
  } = useWorkflowEditor();

  const handleInit = (instance: any) => {
    setFlowInstance(instance);
    
    // Add the saveWorkflow method to the instance
    instance.saveWorkflow = async (name: string) => {
      // Implementation handled by useWorkflowSync now
      return currentWorkflowId || '';
    };
    
    // Add automation node if requested
    if (targetData?.createAutomationNode && instance) {
      // Simulate adding an automation node based on target type
      setTimeout(() => {
        if (targetData.targetType) {
          const automationNode = {
            id: `automation-${Date.now()}`,
            type: 'automation',
            position: { x: 100, y: 100 },
            data: {
              label: `${targetData.targetType.charAt(0).toUpperCase() + targetData.targetType.slice(1)} Automation`,
              automationId: 1, // Default to a generic automation
              targetType: targetData.targetType,
              targetId: targetData.targetId
            }
          };
          
          handleAddAutomation(automationNode);
        }
      }, 500);
    }
  };

  return (
    <BaseLayout>
      <div className="flex h-full flex-col">
        <div className="px-4 py-2 border-b">
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
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          <NodeSidebar handleAddAutomation={handleAddAutomation} />
          
          <div className="flex-1 overflow-hidden relative">
            <Flow
              ref={flowRef}
              onInit={handleInit}
              workflowId={currentWorkflowId}
              initialData={initialFlowData}
            />
            
            <div className="absolute bottom-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-md px-3 py-1 shadow-sm border">
              <WorkflowSyncStatus
                lastSavedAt={lastSavedAt}
                isSyncing={isSyncing}
                hasUnsavedChanges={hasUnsavedChanges}
                onSave={() => handleSaveWorkflow()}
                isUserLoggedIn={isUserLoggedIn}
              />
            </div>
          </div>
        </div>
      </div>
      
      <WorkflowSaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSaveConfirm}
        isSaving={isSaving}
        initialName={workflowName}
        initialDescription={workflowDescription}
        initialCategory={workflowCategory}
      />
      
      <WorkflowLoadDialog
        open={loadDialogOpen}
        onOpenChange={setLoadDialogOpen}
        onLoadWorkflow={handleLoadWorkflow}
      />
    </BaseLayout>
  );
};

export default Workflow;
