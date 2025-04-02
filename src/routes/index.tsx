
import React, { Suspense } from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingFallback } from './loading-fallback';

// Direct import for NotFound page
const NotFoundPage = React.lazy(() => import('@/pages/NotFound'));

// Import route components directly instead of functions that return JSX
import { authRoutes } from './auth-routes';
import { dashboardRoutes } from './dashboard-routes';
import { customerRoutes } from './customer-routes';
import { jobRoutes } from './job-routes';
import { calendarRoutes } from './calendar-routes';
import { communicationRoutes } from './communication-routes';
import { financialRoutes } from './financial-routes';
import { activityRoutes } from './activity-routes';
import { teamRoutes } from './team-routes';
import { settingsRoutes } from './settings-routes';
import { expensesRoutes } from './expenses-route';

export function Routes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterRoutes>
        {/* Render all route configurations directly */}
        {authRoutes}
        {dashboardRoutes}
        {customerRoutes}
        {jobRoutes}
        {calendarRoutes}
        {communicationRoutes}
        {financialRoutes}
        {activityRoutes}
        {teamRoutes}
        {settingsRoutes}
        {expensesRoutes}
        
        {/* 404 Route */}
        <Route path="*" element={
          <Suspense fallback={<LoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        } />
      </RouterRoutes>
    </Suspense>
  );
}
