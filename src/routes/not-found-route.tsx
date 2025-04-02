
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { LoadingFallback } from './loading-fallback';

// Import pages
const NotFoundPage = React.lazy(() => import('@/pages/NotFound'));

export const NotFoundRoute = () => {
  return (
    <Route path="*" element={
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    } />
  );
};
