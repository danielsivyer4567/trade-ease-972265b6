import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

const BankingPage = React.lazy(() => import('@/pages/Banking'));
const PaymentsPage = React.lazy(() => import('@/pages/Payments'));
const ExpensesPage = React.lazy(() => import('@/pages/Expenses'));
const InvoicesPage = React.lazy(() => import('@/pages/Invoices'));
const QuotesPage = React.lazy(() => import('@/pages/Quotes'));
const NewQuotePage = React.lazy(() => import('@/pages/Quotes/NewQuote'));
const JobFinancialsPage = React.lazy(() => import('@/pages/Financials/JobFinancials'));

export const financialRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route path="/banking" element={<Suspense fallback={<LoadingFallback />}><BankingPage /></Suspense>} />
    <Route path="/payments" element={<Suspense fallback={<LoadingFallback />}><PaymentsPage /></Suspense>} />
    <Route path="/expenses" element={<Suspense fallback={<LoadingFallback />}><ExpensesPage /></Suspense>} />
    <Route path="/invoices" element={<Suspense fallback={<LoadingFallback />}><InvoicesPage /></Suspense>} />
    <Route path="/quotes" element={<Suspense fallback={<LoadingFallback />}><QuotesPage /></Suspense>} />
    <Route path="/quotes/new" element={<Suspense fallback={<LoadingFallback />}><NewQuotePage /></Suspense>} />
    <Route path="/financials/job/:jobId" element={<Suspense fallback={<LoadingFallback />}><JobFinancialsPage /></Suspense>} />
  </Route>
);
