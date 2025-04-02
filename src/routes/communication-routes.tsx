
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import pages
const EmailPage = React.lazy(() => import('@/pages/Email'));
const NotificationsPage = React.lazy(() => import('@/pages/Notifications'));
const MessagingPage = React.lazy(() => import('@/pages/Messaging'));
const ReferralsPage = React.lazy(() => import('@/pages/Referrals'));

// Export routes as JSX elements
export const communicationRoutes = (
  <>
    <Route element={<ProtectedRoute />}>
      <Route path="/email" element={
        <Suspense fallback={<LoadingFallback />}>
          <EmailPage />
        </Suspense>
      } />
      <Route path="/notifications" element={
        <Suspense fallback={<LoadingFallback />}>
          <NotificationsPage />
        </Suspense>
      } />
      <Route path="/messaging" element={
        <Suspense fallback={<LoadingFallback />}>
          <MessagingPage />
        </Suspense>
      } />
      <Route path="/referrals" element={
        <Suspense fallback={<LoadingFallback />}>
          <ReferralsPage />
        </Suspense>
      } />
    </Route>
  </>
);
