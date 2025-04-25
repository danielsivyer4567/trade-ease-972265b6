import React, { Suspense, ReactNode, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoadingFallback } from './loading-fallback';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { authRoutes } from './auth-routes';
import { templateRoutes } from './template-routes';
import { jobRoutes } from './job-routes';
import { activityRoutes } from './activity-routes';
import { calendarRoutes } from './calendar-routes';
import { communicationRoutes } from './communication-routes';
import { dashboardRoutes } from './dashboard-routes';
import { expensesRoutes } from './expenses-route';
import { financialRoutes } from './financial-routes';
import { paymentRoutes } from './payment-routes';
import { SettingsRoutes } from './settings-routes';
import { teamRoutes } from './team-routes';
import { tradingRoutes } from './trading-routes';

// Direct imports for main page components
import DashboardPage from '../pages/Dashboard';
import JobsPage from '../pages/Jobs';
import JobDetails from '../pages/JobDetails';
import MaterialOrdering from '../pages/MaterialOrdering';
import Statistics from '../pages/Statistics';
import Tasks from '../pages/Tasks';
import Performance from '../pages/Performance';
import DevelopmentEntry from '../pages/DevelopmentEntry';
import NotFoundPage from '../pages/NotFound/NotFoundPage';
import AIFeatures from '../pages/AIFeatures';
import TeamRed from '../pages/TeamRed';
import TeamBlue from '../pages/TeamBlue';
import TeamGreen from '../pages/TeamGreen';
import TeamNew from '../pages/TeamNew';
import Customers from '../pages/Customers';
import Workflow from '../pages/Workflow';
import PropertyBoundaries from '../pages/PropertyBoundaries';
import SiteAudits from '../pages/SiteAudits';
import Inventory from '../pages/Inventory';
import Calendar from '../pages/Calendar';
import Messaging from '../pages/Messaging';
import Teams from '../pages/Teams';
import Trading from '../pages/Trading';
import TradeDash from '../pages/TradeDash';
import TagsPage from '../pages/Tags/TagsPage';

// Lazy load pages
const InvoicesPage = lazy(() => import('../pages/Invoices'));
const NewInvoice = lazy(() => import('../pages/Invoices/NewInvoice'));
const InvoiceDetail = lazy(() => import('../pages/Invoices/InvoiceDetail'));
const PaymentsPage = lazy(() => import('../pages/Payments'));
const NewPayment = lazy(() => import('../pages/Payments/NewPayment'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage').then(module => ({ default: module.default })));
const AuthPage = lazy(() => import('../pages/Auth'));
const QuotesPage = lazy(() => import('../pages/Quotes'));
const ExpensesPage = lazy(() => import('../pages/Expenses'));
const BankingPage = lazy(() => import('../pages/Banking'));
const SuppliersPage = lazy(() => import('../pages/Suppliers'));
const PurchaseOrdersPage = lazy(() => import('../pages/PurchaseOrders'));
const CredentialsPage = lazy(() => import('../pages/Credentials'));

// Helper component to wrap routes with Suspense
const SuspenseWrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
);

// Create the router configuration
const router = createBrowserRouter([
  {
    path: '/auth/*',
    element: <SuspenseWrapper><AuthPage /></SuspenseWrapper>
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'jobs',
        element: <JobsPage />
      },
      {
        path: 'jobs/:id',
        element: <JobDetails />
      },
      {
        path: 'material-ordering',
        element: <MaterialOrdering />
      },
      {
        path: 'statistics',
        element: <Statistics />
      },
      {
        path: 'tasks',
        element: <Tasks />
      },
      {
        path: 'performance',
        element: <Performance />
      },
      {
        path: 'development',
        element: <DevelopmentEntry />
      },
      {
        path: 'ai-features',
        element: <AIFeatures />
      },
      {
        path: 'team-red',
        element: <TeamRed />
      },
      {
        path: 'team-blue',
        element: <TeamBlue />
      },
      {
        path: 'team-green',
        element: <TeamGreen />
      },
      {
        path: 'team-new',
        element: <TeamNew />
      },
      {
        path: 'customers',
        element: <Customers />
      },
      {
        path: 'workflow',
        element: <Workflow />
      },
      {
        path: 'property-boundaries',
        element: <PropertyBoundaries />
      },
      {
        path: 'site-audits',
        element: <SiteAudits />
      },
      {
        path: 'inventory',
        element: <Inventory />
      },
      {
        path: 'calendar',
        element: <Calendar />
      },
      {
        path: 'messaging',
        element: <Messaging />
      },
      {
        path: 'teams',
        element: <Teams />
      },
      {
        path: 'trading',
        element: <Trading />
      },
      {
        path: 'trade-dash',
        element: <TradeDash />
      },
      {
        path: 'tags',
        element: <TagsPage />
      },
      {
        path: 'payments',
        element: <SuspenseWrapper><PaymentsPage /></SuspenseWrapper>
      },
      {
        path: 'payments/new',
        element: <SuspenseWrapper><NewPayment /></SuspenseWrapper>
      },
      {
        path: 'invoices',
        element: <SuspenseWrapper><InvoicesPage /></SuspenseWrapper>
      },
      {
        path: 'invoices/new',
        element: <SuspenseWrapper><NewInvoice /></SuspenseWrapper>
      },
      {
        path: 'invoices/:id',
        element: <SuspenseWrapper><InvoiceDetail /></SuspenseWrapper>
      },
      {
        path: 'settings/*',
        element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper>
      },
      // Add new routes for missing pages
      {
        path: 'quotes',
        element: <SuspenseWrapper><QuotesPage /></SuspenseWrapper>
      },
      {
        path: 'expenses',
        element: <SuspenseWrapper><ExpensesPage /></SuspenseWrapper>
      },
      {
        path: 'banking',
        element: <SuspenseWrapper><BankingPage /></SuspenseWrapper>
      },
      {
        path: 'suppliers',
        element: <SuspenseWrapper><SuppliersPage /></SuspenseWrapper>
      },
      {
        path: 'purchase-orders',
        element: <SuspenseWrapper><PurchaseOrdersPage /></SuspenseWrapper>
      },
      {
        path: 'credentials',
        element: <SuspenseWrapper><CredentialsPage /></SuspenseWrapper>
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
]);

const exportedRouter = router;
export { exportedRouter as router };
export default exportedRouter;

