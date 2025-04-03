
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import pages
const CustomersPage = React.lazy(() => import('@/pages/Customers'));
const CustomerDetailPage = React.lazy(() => import('@/pages/Customers/CustomerDetail'));
const CustomerStatementPage = React.lazy(() => import('@/pages/Customers/CustomerStatement'));
const NewCustomerPage = React.lazy(() => import('@/pages/Customers/NewCustomer'));
const NetworksPage = React.lazy(() => import('@/pages/Networks'));

// Export routes as JSX elements
export const customerRoutes = (
  <>
    <Route element={<ProtectedRoute />}>
      <Route path="/customers" element={
        <Suspense fallback={<LoadingFallback />}>
          <CustomersPage />
        </Suspense>
      } />
      <Route path="/customers/new" element={
        <Suspense fallback={<LoadingFallback />}>
          <NewCustomerPage />
        </Suspense>
      } />
      <Route path="/customers/:id" element={
        <Suspense fallback={<LoadingFallback />}>
          <CustomerDetailPage />
        </Suspense>
      } />
      <Route path="/customers/:id/statement" element={
        <Suspense fallback={<LoadingFallback />}>
          <CustomerStatementPage />
        </Suspense>
      } />
      <Route path="/networks" element={
        <Suspense fallback={<LoadingFallback />}>
          <NetworksPage />
        </Suspense>
      } />
    </Route>
  </>
);
