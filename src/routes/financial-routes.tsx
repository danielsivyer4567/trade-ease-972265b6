import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { SuspenseWrapper } from './utils/index';

const BankingPage = lazy(() => import('@/pages/Banking'));
const PaymentsPage = lazy(() => import('@/pages/Payments'));
const ExpensesPage = lazy(() => import('@/pages/Expenses'));

export const financialRoutes: RouteObject = {
  path: 'financial',
  children: [
    { path: 'banking', element: <SuspenseWrapper><BankingPage /></SuspenseWrapper> },
    { path: 'payments', element: <SuspenseWrapper><PaymentsPage /></SuspenseWrapper> },
    { path: 'expenses', element: <SuspenseWrapper><ExpensesPage /></SuspenseWrapper> },
  ]
};
