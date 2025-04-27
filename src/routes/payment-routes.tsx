import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import pages
const PaymentsPage = lazy(() => import('@/pages/Payments'));
const NewPayment = lazy(() => import('@/pages/Payments/NewPayment'));

// Export routes as JSX elements
export const paymentRoutes: RouteObject = {
  element: <ProtectedRoute />,
  children: [
    {
      path: 'payments',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <PaymentsPage />
        </Suspense>
      ),
    },
    {
      path: 'payments/new',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <NewPayment />
        </Suspense>
      ),
    },
  ],
};
