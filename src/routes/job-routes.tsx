import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import pages
const JobsPage = React.lazy(() => import('@/pages/Jobs'));
const NewJobPage = React.lazy(() => import('@/pages/Jobs/NewJob'));
const JobDetailsPage = React.lazy(() => import('@/pages/Jobs/JobDetails').then(module => ({ default: module.JobDetails })));
const NewTemplatePage = React.lazy(() => import('@/pages/Jobs/NewTemplate'));
const PropertyBoundariesPage = React.lazy(() => import('@/pages/PropertyBoundaries'));
const CustomerProgressPage = React.lazy(() => import('@/pages/Jobs/CustomerProgress'));

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
      <Route path="/jobs/templates/new" element={
        <Suspense fallback={<LoadingFallback />}>
          <NewTemplatePage />
        </Suspense>
      } />
      <Route path="/jobs/:id" element={
        <Suspense fallback={<LoadingFallback />}>
          <JobDetailsPage />
        </Suspense>
      } />
      <Route path="/property-boundaries" element={
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <PropertyBoundariesPage />
          </Suspense>
        </ErrorBoundary>
      } />
    </Route>
    
    {/* Public route for customer progress tracking - no authentication required */}
    <Route path="/progress/:id" element={
      <Suspense fallback={<LoadingFallback />}>
        <CustomerProgressPage />
      </Suspense>
    } />
  </>
);
