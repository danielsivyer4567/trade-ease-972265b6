import React from 'react';
import { N8nWorkflowList } from '@/components/n8n/N8nWorkflowList';

export default function N8nWorkflowListPage() {
  const handleSelectWorkflow = (workflow: any) => {
    console.log('Selected workflow:', workflow);
  };

  return (
    <div className="container mx-auto py-6">
      <N8nWorkflowList onSelectWorkflow={handleSelectWorkflow} />
    </div>
  );
} 