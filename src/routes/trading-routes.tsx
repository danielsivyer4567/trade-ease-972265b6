
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Import pages
const TradingPage = React.lazy(() => import('@/pages/Trading'));
const TradeDashboardPage = React.lazy(() => import('@/pages/TradeDash'));

// Export an array of route elements
export const tradingRoutes = (
  <>
    <Route path="/trading" element={
      <Suspense fallback={<LoadingFallback />}>
        <TradingPage />
      </Suspense>
    } />
    <Route path="/trade-dashboard" element={
      <Suspense fallback={<LoadingFallback />}>
        <TradeDashboardPage />
      </Suspense>
    } />
  </>
);
