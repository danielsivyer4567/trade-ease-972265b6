
import React, { Suspense } from 'react';
import { Route, Navigate } from 'react-router-dom';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Import pages
const AuthPage = React.lazy(() => import('@/pages/Auth'));

export const AuthRoutes = () => {
  return (
    <>
      <Route path="/auth/*" element={
        <Suspense fallback={<LoadingFallback />}>
          <AuthPage />
        </Suspense>
      } />
    </>
  );
};
