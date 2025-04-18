import React, { Suspense, lazy } from 'react';
import { Routes as RouterRoutes, Route, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingFallback } from './loading-fallback';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { authRoutes } from './auth-routes';
import { SettingsRoutes } from './settings-routes';

// Lazy load page components
const SiteAuditsPage = lazy(() => import('@/pages/SiteAudits'));
const CustomersPage = lazy(() => import('@/pages/Customers/CustomersPage'));
const CustomerDetailsPage = lazy(() => import('@/pages/Customers/CustomerDetail'));
const QuotePage = lazy(() => import('@/pages/Quotes'));
const JobPage = lazy(() => import('@/pages/Jobs'));

export function Routes() {
  const { user, loading } = useAuth();
  const settingsRoutes = SettingsRoutes();

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterRoutes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/site-audits" replace />} />
        
        {/* Auth routes */}
        {authRoutes}

        <Route element={<ProtectedRoute />}>
          {/* Settings routes */}
          <Route path="settings/*">
            {settingsRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
          
          {/* Site Audits routes */}
          <Route path="/site-audits">
            <Route index element={
              <Suspense fallback={<LoadingFallback />}>
                <SiteAuditsPage />
              </Suspense>
            } />
            <Route path="new" element={
              <Suspense fallback={<LoadingFallback />}>
                <SiteAuditsPage />
              </Suspense>
            } />
          </Route>

          {/* Customer routes */}
          <Route path="/customers">
            <Route index element={
              <Suspense fallback={<LoadingFallback />}>
                <CustomersPage />
              </Suspense>
            } />
            <Route path=":auditId" element={
              <Suspense fallback={<LoadingFallback />}>
                <CustomersPage />
              </Suspense>
            } />
            <Route path=":auditId/:customerId" element={
              <Suspense fallback={<LoadingFallback />}>
                <CustomerDetailsPage />
              </Suspense>
            } />
          </Route>

          <Route path="/quote" element={
            <Suspense fallback={<LoadingFallback />}>
              <QuotePage />
            </Suspense>
          } />
          
          <Route path="/job" element={
            <Suspense fallback={<LoadingFallback />}>
              <JobPage />
            </Suspense>
          } />
        </Route>
      </RouterRoutes>
    </Suspense>
  );
}
