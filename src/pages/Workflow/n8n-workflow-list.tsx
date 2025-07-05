import React from 'react';
import { N8nWorkflowList } from '@/components/n8n/N8nWorkflowList';
import { BaseLayout } from '@/components/ui/BaseLayout';

export default function N8nWorkflowListPage() {
  const handleSelectWorkflow = (workflow: any) => {
    console.log('Selected workflow:', workflow);
  };

  return (
    <BaseLayout showQuickTabs>
      <N8nWorkflowList onSelectWorkflow={handleSelectWorkflow} />
    </BaseLayout>
  );
} 