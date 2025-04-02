
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { LoadingFallback } from './loading-fallback';

// Import pages
const NotFoundPage = React.lazy(() => import('@/pages/NotFound'));

// Export routes as JSX elements
export const notFoundRoute = (
  <Route path="*" element={
    <Suspense fallback={<LoadingFallback />}>
      <NotFoundPage />
    </Suspense>
  } />
);
