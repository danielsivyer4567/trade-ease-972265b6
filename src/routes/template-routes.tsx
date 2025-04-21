import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { LoadingFallback } from './loading-fallback';

const ConstructionQuote = lazy(() => import('@/components/templates/ConstructionQuote'));
const MinimalistQuote = lazy(() => import('@/components/templates/MinimalistQuote'));
const ConstructionEstimate = lazy(() => import('@/components/templates/ConstructionEstimate'));
const ConstructionTemplates = lazy(() => import('@/components/templates/ConstructionTemplates'));

export const templateRoutes: RouteObject = {
  path: 'templates',
  children: [
    {
      path: 'construction',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <ConstructionTemplates />
        </Suspense>
      ),
    },
    {
      path: 'construction-quote',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <ConstructionQuote />
        </Suspense>
      ),
    },
    {
      path: 'minimalist-quote',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <MinimalistQuote />
        </Suspense>
      ),
    },
    {
      path: 'construction-estimate',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <ConstructionEstimate />
        </Suspense>
      ),
    },
  ],
}; 