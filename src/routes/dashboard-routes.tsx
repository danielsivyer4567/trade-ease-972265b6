import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';
import ErrorBoundary from '@/components/ErrorBoundary';

// Import pages
const DashboardPage = React.lazy(() => import('@/pages/index'));
const TradeDashPage = React.lazy(() => import('@/pages/TradeDash'));
const PerformancePage = React.lazy(() => import('@/pages/Performance'));
const StatisticsPage = React.lazy(() => import('@/pages/Statistics'));
const AIFeaturesPage = React.lazy(() => import('@/pages/AIFeatures'));
const PropertyBoundariesPage = React.lazy(() => import('@/pages/PropertyBoundaries'));

// Dashboard routes
export const dashboardRoutes = (
  <>
    {/* 
      Main Dashboard Routes
      - These routes are now integrated into a single unified dashboard
      - But we keep them separate for direct URL access and deep linking
    */}
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={
        <Suspense fallback={<LoadingFallback />}>
          <DashboardPage />
        </Suspense>
      } />
      <Route path="/statistics" element={
        <Suspense fallback={<LoadingFallback />}>
          <StatisticsPage />
        </Suspense>
      } />
      <Route path="/performance" element={
        <Suspense fallback={<LoadingFallback />}>
          <PerformancePage />
        </Suspense>
      } />
      <Route path="/trade-dashboard" element={
        <Suspense fallback={<LoadingFallback />}>
          <TradeDashPage />
        </Suspense>
      } />
      <Route path="/ai-features" element={
        <Suspense fallback={<LoadingFallback />}>
          <AIFeaturesPage />
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
  </>
);
