
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import pages
const TeamsPage = React.lazy(() => import('@/pages/Teams'));
const TeamRedPage = React.lazy(() => import('@/pages/TeamRed'));
const TeamBluePage = React.lazy(() => import('@/pages/TeamBlue'));
const TeamGreenPage = React.lazy(() => import('@/pages/TeamGreen'));
const TeamNewPage = React.lazy(() => import('@/pages/TeamNew'));
const SocialPage = React.lazy(() => import('@/pages/Social'));

// Export routes as JSX elements
export const teamRoutes = (
  <>
    <Route element={<ProtectedRoute />}>
      <Route path="/teams" element={
        <Suspense fallback={<LoadingFallback />}>
          <TeamsPage />
        </Suspense>
      } />
      <Route path="/team-red" element={
        <Suspense fallback={<LoadingFallback />}>
          <TeamRedPage />
        </Suspense>
      } />
      <Route path="/team-blue" element={
        <Suspense fallback={<LoadingFallback />}>
          <TeamBluePage />
        </Suspense>
      } />
      <Route path="/team-green" element={
        <Suspense fallback={<LoadingFallback />}>
          <TeamGreenPage />
        </Suspense>
      } />
      <Route path="/team-new" element={
        <Suspense fallback={<LoadingFallback />}>
          <TeamNewPage />
        </Suspense>
      } />
      <Route path="/social" element={
        <Suspense fallback={<LoadingFallback />}>
          <SocialPage />
        </Suspense>
      } />
    </Route>
  </>
);
