
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Import pages
const CalendarPage = React.lazy(() => import('@/pages/Calendar'));
const TeamCalendarPage = React.lazy(() => import('@/pages/Calendar/TeamCalendarPage'));
const CalendarSyncPage = React.lazy(() => import('@/pages/Calendar/CalendarSync'));

export const CalendarRoutes = () => {
  return (
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
  );
};
