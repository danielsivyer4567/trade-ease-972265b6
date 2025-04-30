import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { SuspenseWrapper } from './utils/index';

const TemplatesPage = lazy(() => import('@/pages/Templates'));

export const templatesRoutes: RouteObject = {
  path: 'templates',
  children: [
    { path: '', element: <SuspenseWrapper><TemplatesPage /></SuspenseWrapper> },
  ]
}; 