
import React, { useState, useCallback } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Flow } from './components/Flow';
import { NodeSidebar } from './components/NodeSidebar';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorkflowPage() {
  const navigate = useNavigate();
  const [flowInstance, setFlowInstance] = useState(null);

  const handleSaveFlow = useCallback(() => {
    if (!flowInstance) return;
    
    const flow = flowInstance.toObject();
    localStorage.setItem('workflow-data', JSON.stringify(flow));
    alert('Workflow saved successfully!');
  }, [flowInstance]);

  return (
    <AppLayout>
      <div className="p-4 h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Workflow Builder</h1>
          </div>
          <Button onClick={handleSaveFlow} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Save Workflow
          </Button>
        </div>

        <div className="flex h-[calc(100vh-200px)] border border-gray-200 rounded-lg overflow-hidden">
          <NodeSidebar />
          <div className="flex-1 relative">
            <Flow onInit={setFlowInstance} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
