import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { LoadingFallback } from './loading-fallback';

// Import pages
const AuthPage = lazy(() => import('@/pages/Auth'));

// Export an array of route elements
export const authRoutes: RouteObject = {
  path: 'auth/*',
  element: (
    <Suspense fallback={<LoadingFallback />}>
      <AuthPage />
    </Suspense>
  ),
};
