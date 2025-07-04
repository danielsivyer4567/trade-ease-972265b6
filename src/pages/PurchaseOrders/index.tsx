
import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { PurchaseOrderHeader } from './components/PurchaseOrderHeader';
import { PurchaseOrderActions } from './components/PurchaseOrderActions';
import { PurchaseOrderTable } from './components/PurchaseOrderTable';
import { PurchaseOrder } from './types';
import { useTabNavigation } from '@/hooks/useTabNavigation';

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
  const [searchQuery, setSearchQuery] = useState("");
  const { openInTab } = useTabNavigation();

  // Filter purchase orders based on search query
  const filteredOrders = searchQuery
    ? purchaseOrders.filter(order => 
        order.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.job.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : purchaseOrders;

  // Handle row click to open the purchase order in a new tab
  const handleRowClick = (order: PurchaseOrder) => {
    openInTab(`/purchase-orders/${order.id}`, `PO: ${order.orderNo}`, `po-${order.id}`);
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-[1600px] mx-auto">
          <PurchaseOrderHeader 
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
          />

          <PurchaseOrderActions 
            onSearch={setSearchQuery}
          />

          <Card>
            <CardContent className="p-0">
              <PurchaseOrderTable 
                purchaseOrders={filteredOrders} 
                onRowClick={handleRowClick}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
