
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
const EmailPage = React.lazy(() => import('@/pages/Email'));
const NotificationsPage = React.lazy(() => import('@/pages/Notifications'));
const MessagingPage = React.lazy(() => import('@/pages/Messaging'));
const ReferralsPage = React.lazy(() => import('@/pages/Referrals'));

export const CommunicationRoutes = () => {
  return (
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
  );
};
