
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import pages
const PaymentsPage = React.lazy(() => import('@/pages/Payments'));
const NewPayment = React.lazy(() => import('@/pages/Payments/NewPayment'));

// Export routes as JSX elements
export const paymentRoutes = (
  <>
    <Route element={<ProtectedRoute />}>
      <Route path="/payments" element={
        <Suspense fallback={<LoadingFallback />}>
          <PaymentsPage />
        </Suspense>
      } />
      <Route path="/payments/new" element={
        <Suspense fallback={<LoadingFallback />}>
          <NewPayment />
        </Suspense>
      } />
    </Route>
  </>
);
