
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import pages
const DashboardPage = React.lazy(() => import('@/pages/index'));
const TradeDashPage = React.lazy(() => import('@/pages/TradeDash'));
const PerformancePage = React.lazy(() => import('@/pages/Performance'));
const CalculatorsPage = React.lazy(() => import('@/pages/Calculators'));
const MarkupCalculator = React.lazy(() => import('@/pages/Calculators/MarkupCalculator'));
const JobCostCalculator = React.lazy(() => import('@/pages/Calculators/JobCostCalculator'));
const LoadsSpansCalculator = React.lazy(() => import('@/pages/Calculators/LoadsSpansCalculator'));
const FencingCalculator = React.lazy(() => import('@/pages/Calculators/FencingCalculator'));
const NCCCodesCalculator = React.lazy(() => import('@/pages/Calculators/NCCCodesCalculator'));
const StatisticsPage = React.lazy(() => import('@/pages/Statistics'));
const AIFeaturesPage = React.lazy(() => import('@/pages/AIFeatures'));

// Export routes as JSX elements
export const dashboardRoutes = (
  <>
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
      <Route path="/performance" element={
        <Suspense fallback={<LoadingFallback />}>
          <PerformancePage />
        </Suspense>
      } />
      <Route path="/calculators" element={
        <Suspense fallback={<LoadingFallback />}>
          <CalculatorsPage />
        </Suspense>
      } />
      <Route path="/calculators/markup" element={
        <Suspense fallback={<LoadingFallback />}>
          <MarkupCalculator />
        </Suspense>
      } />
      <Route path="/calculators/job-cost" element={
        <Suspense fallback={<LoadingFallback />}>
          <JobCostCalculator />
        </Suspense>
      } />
      <Route path="/calculators/loads-spans" element={
        <Suspense fallback={<LoadingFallback />}>
          <LoadsSpansCalculator />
        </Suspense>
      } />
      <Route path="/calculators/fencing" element={
        <Suspense fallback={<LoadingFallback />}>
          <FencingCalculator />
        </Suspense>
      } />
      <Route path="/calculators/ncc-codes" element={
        <Suspense fallback={<LoadingFallback />}>
          <NCCCodesCalculator />
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
  </>
);
