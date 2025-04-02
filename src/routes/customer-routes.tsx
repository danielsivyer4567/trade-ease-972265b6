
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Import pages
const CustomersPage = React.lazy(() => import('@/pages/Customers'));
const CustomerDetailPage = React.lazy(() => import('@/pages/Customers/CustomerDetail'));
const NewCustomerPage = React.lazy(() => import('@/pages/Customers/NewCustomer'));
const NetworksPage = React.lazy(() => import('@/pages/Networks'));

export const CustomerRoutes = () => {
  return (
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
      <Route path="/networks" element={
        <Suspense fallback={<LoadingFallback />}>
          <NetworksPage />
        </Suspense>
      } />
    </Route>
  );
};
