
import React from 'react';
import { Route } from 'react-router-dom';

// Purchase Orders
const PurchaseOrders = React.lazy(() => import('@/pages/PurchaseOrders/index'));
const CreatePurchaseOrder = React.lazy(() => import('@/pages/PurchaseOrders/CreatePurchaseOrder'));
const PurchaseOrderView = React.lazy(() => import('@/pages/PurchaseOrders/PurchaseOrderView'));

export const supplyChainRoutes = (
  <>
    <Route path="/purchase-orders" element={<PurchaseOrders />} />
    <Route path="/purchase-orders/create" element={<CreatePurchaseOrder />} />
    <Route path="/purchase-orders/:id" element={<PurchaseOrderView />} />
  </>
);
