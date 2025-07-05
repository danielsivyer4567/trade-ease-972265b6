import React from 'react';
import { useParams } from 'react-router-dom';
import { N8nWorkflowEditor } from '@/components/n8n/N8nWorkflowEditor';
import { AppLayout } from '@/components/ui/AppLayout';

export default function N8nWorkflowPage() {
  const { id } = useParams();

  const handleSave = (workflowData: any) => {
    console.log('Workflow saved:', workflowData);
  };

  const handleExecute = (workflowId: string, inputData?: any) => {
    console.log('Workflow executed:', workflowId, inputData);
  };

  return (
    <AppLayout>
    <div className="h-screen w-full">
      <N8nWorkflowEditor
        workflowId={id}
        onSave={handleSave}
        onExecute={handleExecute}
        readOnly={false}
        height="100vh"
      />
    </div>
    </AppLayout>
  );
} 