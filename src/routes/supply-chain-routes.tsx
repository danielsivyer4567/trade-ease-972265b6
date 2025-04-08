
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import pages
const SuppliersPage = React.lazy(() => import('@/pages/Suppliers'));
const InventoryPage = React.lazy(() => import('@/pages/Inventory'));
const PurchaseOrdersPage = React.lazy(() => import('@/pages/PurchaseOrders'));
const JobMaterialOrderingPage = React.lazy(() => import('@/pages/Jobs/JobMaterialOrdering'));

// Export routes as JSX elements
export const supplyChainRoutes = (
  <>
    <Route element={<ProtectedRoute />}>
      <Route path="/suppliers" element={
        <Suspense fallback={<LoadingFallback />}>
          <SuppliersPage />
        </Suspense>
      } />
      
      <Route path="/inventory" element={
        <Suspense fallback={<LoadingFallback />}>
          <InventoryPage />
        </Suspense>
      } />
      
      <Route path="/purchase-orders" element={
        <Suspense fallback={<LoadingFallback />}>
          <PurchaseOrdersPage />
        </Suspense>
      } />
      
      <Route path="/material-ordering" element={
        <Suspense fallback={<LoadingFallback />}>
          <JobMaterialOrderingPage />
        </Suspense>
      } />
    </Route>
  </>
);
