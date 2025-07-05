import React from 'react';
import { N8nWorkflowList } from '@/components/n8n/N8nWorkflowList';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { AppLayout } from '@/components/ui/AppLayout';

export default function N8nWorkflowListPage() {
  const handleSelectWorkflow = (workflow: any) => {
    console.log('Selected workflow:', workflow);
  };

  return (
    <AppLayout showQuickTabs>
      <N8nWorkflowList onSelectWorkflow={handleSelectWorkflow} />
    </AppLayout>
  );
} 