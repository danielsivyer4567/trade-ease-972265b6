
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import pages
const TradingPage = React.lazy(() => import('@/pages/Trading'));

// Export routes as JSX elements
export const tradingRoutes = (
  <>
    <Route element={<ProtectedRoute />}>
      <Route path="/trading" element={
        <Suspense fallback={<LoadingFallback />}>
          <TradingPage />
        </Suspense>
      } />
    </Route>
  </>
);
