import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import { LoadingFallback } from './loading-fallback';

const ConstructionQuote = lazy(() => import('@/components/templates/ConstructionQuote'));
const MinimalistQuote = lazy(() => import('@/components/templates/MinimalistQuote'));
const ConstructionEstimate = lazy(() => import('@/components/templates/ConstructionEstimate'));
const ConstructionTemplates = lazy(() => import('@/components/templates/ConstructionTemplates'));
const TemplateTest = lazy(() => import('@/components/templates/TemplateTest'));

// Create a simple debug component to test routing
const DebugComponent = () => (
  <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
    <h1 style={{ color: '#333' }}>Debug Route</h1>
    <p>If you can see this message, routing is working correctly for the templates path.</p>
    <p>Current time: {new Date().toLocaleTimeString()}</p>
  </div>
);

export const templateRoutes: RouteObject = {
  path: 'templates',
  children: [
    {
      index: true,
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <ConstructionTemplates />
        </Suspense>
      ),
    },
    {
      path: 'construction',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <ConstructionTemplates />
        </Suspense>
      ),
    },
    {
      path: 'debug',
      element: <DebugComponent />,
    },
    {
      path: 'test',
      element: (
        <Suspense fallback={<LoadingFallback />}>
          <TemplateTest />
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