
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import pages
const QuotesPage = React.lazy(() => import('@/pages/Quotes'));
const QuotesInvoicesPage = React.lazy(() => import('@/pages/QuotesInvoices'));
const NewInvoice = React.lazy(() => import('@/pages/Invoices/NewInvoice'));
const BankingPage = React.lazy(() => import('@/pages/Banking'));
// Fixed import paths for JobInvoices and InvoiceDetail
const JobInvoicesPage = React.lazy(() => import('@/pages/Invoices/JobInvoices'));
const InvoiceDetailPage = React.lazy(() => import('@/pages/Invoices/InvoiceDetail'));

// Export routes as JSX elements
export const financialRoutes = (
  <>
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
      <Route path="/invoices/job/:jobId" element={
        <Suspense fallback={<LoadingFallback />}>
          <JobInvoicesPage />
        </Suspense>
      } />
      <Route path="/invoices/:id" element={
        <Suspense fallback={<LoadingFallback />}>
          <InvoiceDetailPage />
        </Suspense>
      } />
      <Route path="/banking" element={
        <Suspense fallback={<LoadingFallback />}>
          <BankingPage />
        </Suspense>
      } />
    </Route>
  </>
);
