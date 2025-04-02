
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
const QuotesPage = React.lazy(() => import('@/pages/Quotes'));
const QuotesInvoicesPage = React.lazy(() => import('@/pages/QuotesInvoices'));
const NewInvoice = React.lazy(() => import('@/pages/Invoices/NewInvoice'));
const BankingPage = React.lazy(() => import('@/pages/Banking'));

export const FinancialRoutes = () => {
  return (
    <Route element={<ProtectedRoute />}>
      <Route path="/quotes" element={
        <Suspense fallback={<LoadingFallback />}>
          <QuotesPage />
        </Suspense>
      } />
      <Route path="/quotes-invoices" element={
        <Suspense fallback={<LoadingFallback />}>
          <QuotesInvoicesPage />
        </Suspense>
      } />
      <Route path="/invoices/new" element={
        <Suspense fallback={<LoadingFallback />}>
          <NewInvoice />
        </Suspense>
      } />
      <Route path="/banking" element={
        <Suspense fallback={<LoadingFallback />}>
          <BankingPage />
        </Suspense>
      } />
    </Route>
  );
};
