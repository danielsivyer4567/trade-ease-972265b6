import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { PurchaseOrderHeader } from './components/PurchaseOrderHeader';
import { PurchaseOrderActions } from './components/PurchaseOrderActions';
import { PurchaseOrderTable } from './components/PurchaseOrderTable';
import { PurchaseOrder } from './types';

const purchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    orderNo: 'PO00005',
    supplier: 'Aaa Timber And Hardware',
    reference: '',
    linkedBill: 'Aaa Timber And Hardware',
    status: 'billed',
    job: 'JB00763',
    orderDate: '21 Jan 2025',
    deliveryDate: '21 Jan 2025',
    total: 500.00,
    sent: true
  },
  {
    id: '2',
    orderNo: 'PO00004',
    supplier: 'Jackson Ryan',
    reference: '',
    linkedBill: 'Jackson Ryan - 18 Jan 2025',
    status: 'billed',
    job: 'JB00764',
    orderDate: '18 Jan 2025',
    deliveryDate: '18 Jan 2025',
    total: 0.00,
    sent: true
  },
  {
    id: '3',
    orderNo: 'PO00003',
    supplier: 'China',
    reference: '',
    linkedBill: 'China - 18 Jan 2025',
    status: 'billed',
    job: 'JB00764',
    orderDate: '18 Jan 2025',
    deliveryDate: '18 Jan 2025',
    total: 1100.00,
    sent: true
  }
];

export default function PurchaseOrders() {
  const [selectedTab, setSelectedTab] = useState('all');

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-[1600px] mx-auto">
          <PurchaseOrderHeader 
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />

          <PurchaseOrderActions 
            onSearch={(value) => console.log('Search:', value)}
          />

          <Card>
            <CardContent className="p-0">
              <PurchaseOrderTable purchaseOrders={purchaseOrders} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
