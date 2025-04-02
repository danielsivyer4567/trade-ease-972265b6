
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import pages
const ActivityPage = React.lazy(() => import('@/pages/Activity'));
const WorkflowPage = React.lazy(() => import('@/pages/Workflow'));
const IntegrationsPage = React.lazy(() => import('@/pages/Integrations'));
const AutomationsPage = React.lazy(() => import('@/pages/Automations'));
const SiteAuditsPage = React.lazy(() => import('@/pages/SiteAudits'));
const FormsPage = React.lazy(() => import('@/pages/Forms'));
const DatabasePage = React.lazy(() => import('@/pages/Database'));

// Export routes as JSX elements
export const activityRoutes = (
  <>
    <Route element={<ProtectedRoute />}>
      <Route path="/activity" element={
        <Suspense fallback={<LoadingFallback />}>
          <ActivityPage />
        </Suspense>
      } />
      <Route path="/workflow" element={
        <Suspense fallback={<LoadingFallback />}>
          <WorkflowPage />
        </Suspense>
      } />
      <Route path="/integrations" element={
        <Suspense fallback={<LoadingFallback />}>
          <IntegrationsPage />
        </Suspense>
      } />
      <Route path="/automations" element={
        <Suspense fallback={<LoadingFallback />}>
          <AutomationsPage />
        </Suspense>
      } />
      <Route path="/site-audits" element={
        <Suspense fallback={<LoadingFallback />}>
          <SiteAuditsPage />
        </Suspense>
      } />
      <Route path="/forms" element={
        <Suspense fallback={<LoadingFallback />}>
          <FormsPage />
        </Suspense>
      } />
      <Route path="/database" element={
        <Suspense fallback={<LoadingFallback />}>
          <DatabasePage />
        </Suspense>
      } />
    </Route>
  </>
);
