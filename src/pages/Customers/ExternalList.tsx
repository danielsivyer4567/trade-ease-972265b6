import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { ExternalCustomerList } from './components/ExternalCustomerList';

export default function ExternalCustomerListPage() {
  return (
    <AppLayout>
      <ExternalCustomerList />
    </AppLayout>
  );
} 