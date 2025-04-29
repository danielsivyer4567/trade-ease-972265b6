import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Key, Check, FileText, ArrowRightLeft, Workflow, FolderOpen, Plus, Settings2 } from "lucide-react";
import { NodeSidebar } from './components/NodeSidebar';
import { Flow } from './components/Flow';
import { WorkflowSaveDialog } from './components/WorkflowSaveDialog';
import { toast } from "sonner";
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';
import { useAuth } from '@/contexts/AuthContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppLayout } from "@/components/ui/AppLayout";

export default function WorkflowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const automationId = searchParams.get('automationId');
  const workflowId = searchParams.get('id');
  const { user } = useAuth();
  
  const [flowInstance, setFlowInstance] = useState(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | undefined>(workflowId || undefined);
  const [workflowName, setWorkflowName] = useState("New Workflow");
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [targetData, setTargetData] = useState<{
    targetType?: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';
    targetId?: string;
    createAutomationNode?: boolean;
  } | null>(null);

  useEffect(() => {
    if (location.state) {
      const { targetType, targetId, createAutomationNode } = location.state as any;
      if (targetType && targetId) {
        setTargetData({
          targetType,
          targetId,
          createAutomationNode: !!createAutomationNode
        });
      }
    }
  }, [location.state]);

  // ... existing code ...

  return (
    <AppLayout>
      <div className="flex flex-col h-screen">
        {/* Top Navigation Bar */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center px-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/workflow/list')}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back to Workflows</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <h2 className="text-lg font-semibold flex-1">
              {currentWorkflowId ? workflowName : "New Workflow"}
            </h2>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSaveDialogOpen(true)}
                      className="flex items-center gap-2"
                      disabled={!user}
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save workflow (Ctrl+S)</p>
                    {!user && <p className="text-xs text-muted-foreground">Login required to save</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          <NodeSidebar targetData={targetData} />
          <div className="flex-1 relative">
            <Flow onInit={setFlowInstance} workflowId={currentWorkflowId} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
