
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import the actual Expenses page component
const ExpensesPage = React.lazy(() => import('@/pages/Expenses'));
// Fixed import path for InvoiceProcessing
const InvoiceProcessingPage = React.lazy(() => import('@/pages/Expenses/InvoiceProcessing'));

// Export the routes as JSX elements
export const expensesRoutes = (
  <>
    <Route element={<ProtectedRoute />}>
      <Route path="/expenses" element={
        <Suspense fallback={<LoadingFallback />}>
          <ExpensesPage />
        </Suspense>
      } />
      <Route path="/expenses/invoices" element={
        <Suspense fallback={<LoadingFallback />}>
          <InvoiceProcessingPage />
        </Suspense>
      } />
    </Route>
  </>
);
