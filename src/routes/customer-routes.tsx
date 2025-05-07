import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import pages
const CustomersPage = React.lazy(() => import('@/pages/Customers/index'));
const CustomerDetailPage = React.lazy(() => import('@/pages/Customers/CustomerDetail'));
const CustomerStatementPage = React.lazy(() => import('@/pages/Customers/CustomerStatement'));
const NewCustomerPage = React.lazy(() => import('@/pages/Customers/NewCustomer'));
const NetworksPage = React.lazy(() => import('@/pages/Networks'));
const CustomerProgressPage = React.lazy(() => import('@/pages/Jobs/CustomerProgress'));
const JobMaterialOrderingPage = React.lazy(() => import('@/pages/Jobs/JobMaterialOrdering'));
const ExternalCustomerListPage = React.lazy(() => import('@/pages/Customers/ExternalList'));
const CustomerConsolePage = React.lazy(() => import('@/pages/Customers/CustomerConsole'));

// Export routes as JSX elements
export const customerRoutes = (
  <>
    <Route path="customers" element={<ProtectedRoute />}>
      <Route index element={
        <Suspense fallback={<LoadingFallback />}>
          <CustomersPage />
        </Suspense>
      } />
      <Route path=":id" element={
        <Suspense fallback={<LoadingFallback />}>
          <CustomerDetailPage />
        </Suspense>
      } />
      <Route path=":id/edit" element={
        <Suspense fallback={<LoadingFallback />}>
          <CustomerDetailPage />
        </Suspense>
      } />
      <Route path=":id/statement" element={
        <Suspense fallback={<LoadingFallback />}>
          <CustomerStatementPage />
        </Suspense>
      } />
      <Route path="new" element={
        <Suspense fallback={<LoadingFallback />}>
          <NewCustomerPage />
        </Suspense>
      } />
      <Route path="external" element={
        <Suspense fallback={<LoadingFallback />}>
          <ExternalCustomerListPage />
        </Suspense>
      } />
      <Route path="console" element={
        <Suspense fallback={<LoadingFallback />}>
          <CustomerConsolePage />
        </Suspense>
      } />
    </Route>
    
    <Route path="networks" element={<ProtectedRoute />}>
      <Route index element={
        <Suspense fallback={<LoadingFallback />}>
          <NetworksPage />
        </Suspense>
      } />
    </Route>
    
    <Route path="jobs" element={<ProtectedRoute />}>
      <Route path="materials/:jobId" element={
        <Suspense fallback={<LoadingFallback />}>
          <JobMaterialOrderingPage />
        </Suspense>
      } />
    </Route>
    
    <Route path="progress/:id" element={
      <Suspense fallback={<LoadingFallback />}>
        <CustomerProgressPage />
      </Suspense>
    } />
  </>
);
