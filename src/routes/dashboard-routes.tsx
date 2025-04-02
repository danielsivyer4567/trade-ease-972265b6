
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
const DashboardPage = React.lazy(() => import('@/pages/index'));
const TradeDashPage = React.lazy(() => import('@/pages/TradeDash'));
const CalculatorsPage = React.lazy(() => import('@/pages/Calculators'));
const StatisticsPage = React.lazy(() => import('@/pages/Statistics'));
const AIFeaturesPage = React.lazy(() => import('@/pages/AIFeatures'));

export const DashboardRoutes = () => {
  return (
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={
        <Suspense fallback={<LoadingFallback />}>
          <DashboardPage />
        </Suspense>
      } />
      <Route path="/tradedash" element={
        <Suspense fallback={<LoadingFallback />}>
          <TradeDashPage />
        </Suspense>
      } />
      <Route path="/calculators/*" element={
        <Suspense fallback={<LoadingFallback />}>
          <CalculatorsPage />
        </Suspense>
      } />
      <Route path="/statistics" element={
        <Suspense fallback={<LoadingFallback />}>
          <StatisticsPage />
        </Suspense>
      } />
      <Route path="/ai-features" element={
        <Suspense fallback={<LoadingFallback />}>
          <AIFeaturesPage />
        </Suspense>
      } />
    </Route>
  );
};
