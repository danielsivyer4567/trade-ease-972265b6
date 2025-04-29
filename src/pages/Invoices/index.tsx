import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { InvoicesPage } from "@/pages/QuotesInvoices/components/InvoicesPage";

export default function Invoices() {
  return (
    <AppLayout>
      <div className="p-6">
        <InvoicesPage />
      </div>
    </AppLayout>
  );
} 