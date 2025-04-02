
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import pages
const JobsPage = React.lazy(() => import('@/pages/Jobs'));
const NewJobPage = React.lazy(() => import('@/pages/Jobs/NewJob'));
const JobDetailsPage = React.lazy(() => import('@/pages/Jobs/JobDetails').then(module => ({ default: module.JobDetails })));
const NewTemplatePage = React.lazy(() => import('@/pages/Jobs/NewTemplate'));
const PropertyBoundariesPage = React.lazy(() => import('@/pages/PropertyBoundaries'));

// Export routes as JSX elements
export const jobRoutes = (
  <>
    <Route element={<ProtectedRoute />}>
      <Route path="/jobs" element={
        <Suspense fallback={<LoadingFallback />}>
          <JobsPage />
        </Suspense>
      } />
      <Route path="/jobs/new" element={
        <Suspense fallback={<LoadingFallback />}>
          <NewJobPage />
        </Suspense>
      } />
      <Route path="/jobs/:id" element={
        <Suspense fallback={<LoadingFallback />}>
          <JobDetailsPage />
        </Suspense>
      } />
      <Route path="/jobs/templates/new" element={
        <Suspense fallback={<LoadingFallback />}>
          <NewTemplatePage />
        </Suspense>
      } />
      <Route path="/property-boundaries" element={
        <Suspense fallback={<LoadingFallback />}>
          <PropertyBoundariesPage />
        </Suspense>
      } />
    </Route>
  </>
);
