
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import pages
const CalendarPage = React.lazy(() => import('@/pages/Calendar'));
const TeamCalendarPage = React.lazy(() => import('@/pages/Calendar/TeamCalendarPage'));
const CalendarSyncPage = React.lazy(() => import('@/pages/Calendar/CalendarSync'));

// Export routes as JSX elements
export const calendarRoutes = (
  <>
    <Route element={<ProtectedRoute />}>
      <Route path="/calendar" element={
        <Suspense fallback={<LoadingFallback />}>
          <CalendarPage />
        </Suspense>
      } />
      <Route path="/calendar/team/:teamColor" element={
        <Suspense fallback={<LoadingFallback />}>
          <TeamCalendarPage />
        </Suspense>
      } />
      <Route path="/calendar/sync" element={
        <Suspense fallback={<LoadingFallback />}>
          <CalendarSyncPage />
        </Suspense>
      } />
    </Route>
  </>
);
