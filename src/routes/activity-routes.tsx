import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { SuspenseWrapper } from './utils/index';

const ActivityPage = lazy(() => import('@/pages/Activity'));
const StatisticsPage = lazy(() => import('@/pages/Statistics'));
const PerformancePage = lazy(() => import('@/pages/Performance'));

export const activityRoutes: RouteObject = {
  path: 'activity',
  children: [
    { path: '', element: <SuspenseWrapper><ActivityPage /></SuspenseWrapper> },
    { path: 'statistics', element: <SuspenseWrapper><StatisticsPage /></SuspenseWrapper> },
    { path: 'performance', element: <SuspenseWrapper><PerformancePage /></SuspenseWrapper> },
  ]
};
