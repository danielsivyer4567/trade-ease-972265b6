import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouteObject, Outlet, Navigate, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingFallback } from './loading-fallback';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { authRoutes } from './auth-routes';
import { SettingsRoutes } from './settings-routes';
import { templateRoutes } from './template-routes';

// Development mode debugging component
const DevelopmentEntry = lazy(() => import('@/pages/DevelopmentEntry'));

// Lazy load main page components
const DashboardPage = lazy(() => import('@/pages/index'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

// Auth pages
const AuthPage = lazy(() => import('@/pages/Auth'));

// Automations page
const AutomationsPage = lazy(() => import('@/pages/Automations'));

// Customer related pages
const CustomersPage = lazy(() => import('@/pages/Customers/CustomersPage'));
const CustomerDetailsPage = lazy(() => import('@/pages/Customers/CustomerDetail'));

// Site Audits
const SiteAuditsPage = lazy(() => import('@/pages/SiteAudits'));

// Jobs
const JobsPage = lazy(() => import('@/pages/Jobs'));
const NewJobPage = lazy(() => import('@/pages/Jobs/NewJob'));

// Quotes and Invoices
const QuotesPage = lazy(() => import('@/pages/Quotes'));
const NewQuotePage = lazy(() => import('@/pages/Quotes/NewQuote'));
{/* const QuoteDetailsPage = lazy(() => import('@/pages/Quote/QuoteDetails')); */}
{/* const InvoicesPage = lazy(() => import('@/pages/Invoices')); */}

// Teams
const TeamRedPage = lazy(() => import('@/pages/TeamRed'));
const TeamBluePage = lazy(() => import('@/pages/TeamBlue'));
const TeamGreenPage = lazy(() => import('@/pages/TeamGreen'));
const TeamNewPage = lazy(() => import('@/pages/TeamNew'));
const TeamsPage = lazy(() => import('@/pages/Teams'));

// Calendar and Scheduling
const CalendarPage = lazy(() => import('@/pages/Calendar'));

// Communication
const EmailPage = lazy(() => import('@/pages/Email'));
const MessagingPage = lazy(() => import('@/pages/Messaging'));
const NotificationsPage = lazy(() => import('@/pages/Notifications'));

// Finance
const BankingPage = lazy(() => import('@/pages/Banking'));
const PaymentsPage = lazy(() => import('@/pages/Payments'));
const ExpensesPage = lazy(() => import('@/pages/Expenses'));
{/* const PayrollPage = lazy(() => import('@/pages/Payroll')); */}

// Trading
const TradingPage = lazy(() => import('@/pages/Trading'));
const TradeDashPage = lazy(() => import('@/pages/TradeDash'));

// Reporting
const StatisticsPage = lazy(() => import('@/pages/Statistics'));
const PerformancePage = lazy(() => import('@/pages/Performance'));
const ActivityPage = lazy(() => import('@/pages/Activity'));

// Supply Chain
const SuppliersPage = lazy(() => import('@/pages/Suppliers'));
const InventoryPage = lazy(() => import('@/pages/Inventory'));
const PurchaseOrdersPage = lazy(() => import('@/pages/PurchaseOrders'));
const MaterialOrderingPage = lazy(() => import('@/pages/MaterialOrdering'));

// Tools and Utilities
const CalculatorsPage = lazy(() => import('@/pages/Calculators'));
const WorkflowPage = lazy(() => import('@/pages/Workflow'));
const WorkflowListPage = lazy(() => import('@/pages/Workflow/WorkflowList'));
const WorkflowTemplatesPage = lazy(() => import('@/pages/Workflow/WorkflowTemplates'));
const WorkflowMetricsPage = lazy(() => import('@/pages/Workflow/WorkflowMetrics'));
const FormsPage = lazy(() => import('@/pages/Forms'));
const TasksPage = lazy(() => import('@/pages/Tasks'));
const AIFeaturesPage = lazy(() => import('@/pages/AIFeatures'));
const PropertyBoundariesPage = lazy(() => import('@/pages/PropertyBoundaries'));
const NetworksPage = lazy(() => import('@/pages/Networks'));
const CredentialsPage = lazy(() => import('@/pages/Credentials'));

// Settings
const SettingsPage = lazy(() => import('@/pages/Settings'));
const IntegrationsPage = lazy(() => import('@/pages/Integrations'));

// Helper component for Suspense boundary
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
);

// Convert JSX auth routes to RouteObjects
const authRouteObjects = createRoutesFromElements(authRoutes);

// Get settings RouteObjects by calling the function
const settingsRouteObjects = SettingsRoutes();

// Define main application routes using RouteObject configuration
const routeObjects: RouteObject[] = [
  // Development Entry (only in dev mode)
  {
    path: "/dev",
    element: <Suspense fallback={<LoadingFallback />}><DevelopmentEntry /></Suspense>
  },
  
  // Auth Routes - flattened to avoid nested routing issues
  {
    path: "/auth",
    element: <Suspense fallback={<LoadingFallback />}><AuthPage /></Suspense>
  },
  
  // Auth Routes (now converted RouteObjects)
  ...authRouteObjects,
  {
    // Protected Routes Layout
    element: <ProtectedRoute />,
    children: [
      { path: "/", element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      // Automations route
      { path: "/automations", element: <SuspenseWrapper><AutomationsPage /></SuspenseWrapper> },
      // Settings Routes
      {
        path: "settings", // Base path for settings
        children: settingsRouteObjects // Nest the objects returned by SettingsRoutes()
      },
      // Template Routes
      templateRoutes,
      // Customer routes
      {
        path: "/customers",
        children: [
          { index: true, element: <SuspenseWrapper><CustomersPage /></SuspenseWrapper> },
          { path: ":auditId", element: <SuspenseWrapper><CustomersPage /></SuspenseWrapper> },
          { path: ":auditId/:customerId", element: <SuspenseWrapper><CustomerDetailsPage /></SuspenseWrapper> },
        ],
      },
      // Site Audits routes
      {
        path: "/site-audits",
        children: [
          { index: true, element: <SuspenseWrapper><SiteAuditsPage /></SuspenseWrapper> },
          { path: "new", element: <SuspenseWrapper><SiteAuditsPage /></SuspenseWrapper> },
        ],
      },
      // Job routes
      { path: "/job", element: <SuspenseWrapper><JobsPage /></SuspenseWrapper> },
      {
        path: "/jobs",
        children: [
          { index: true, element: <SuspenseWrapper><JobsPage /></SuspenseWrapper> },
          { path: "new", element: <SuspenseWrapper><NewJobPage /></SuspenseWrapper> },
        ],
      },
      // Quote routes
      { path: "/quote", element: <SuspenseWrapper><QuotesPage /></SuspenseWrapper> },
      {
        path: "/quotes",
        children: [
          { index: true, element: <SuspenseWrapper><NewQuotePage /></SuspenseWrapper> },
          { path: "empty", element: <SuspenseWrapper><QuotesPage /></SuspenseWrapper> },
          { path: "new", element: <SuspenseWrapper><NewQuotePage /></SuspenseWrapper> },
        ],
      },
      // Team routes
      { path: "/teams", element: <SuspenseWrapper><TeamsPage /></SuspenseWrapper> },
      { path: "/team-red", element: <SuspenseWrapper><TeamRedPage /></SuspenseWrapper> },
      { path: "/team-blue", element: <SuspenseWrapper><TeamBluePage /></SuspenseWrapper> },
      { path: "/team-green", element: <SuspenseWrapper><TeamGreenPage /></SuspenseWrapper> },
      { path: "/team-new", element: <SuspenseWrapper><TeamNewPage /></SuspenseWrapper> },
      // Calendar route
      { path: "/calendar", element: <SuspenseWrapper><CalendarPage /></SuspenseWrapper> },
      // Communication routes
      { path: "/email", element: <SuspenseWrapper><EmailPage /></SuspenseWrapper> },
      { path: "/messaging", element: <SuspenseWrapper><MessagingPage /></SuspenseWrapper> },
      { path: "/notifications", element: <SuspenseWrapper><NotificationsPage /></SuspenseWrapper> },
      // Finance routes
      { path: "/banking", element: <SuspenseWrapper><BankingPage /></SuspenseWrapper> },
      { path: "/payments", element: <SuspenseWrapper><PaymentsPage /></SuspenseWrapper> },
      { path: "/expenses", element: <SuspenseWrapper><ExpensesPage /></SuspenseWrapper> },
      // Trading routes
      { path: "/trading", element: <SuspenseWrapper><TradingPage /></SuspenseWrapper> },
      { path: "/tradedash", element: <SuspenseWrapper><TradeDashPage /></SuspenseWrapper> },
      // Reporting routes
      { path: "/statistics", element: <SuspenseWrapper><StatisticsPage /></SuspenseWrapper> },
      { path: "/performance", element: <SuspenseWrapper><PerformancePage /></SuspenseWrapper> },
      { path: "/activity", element: <SuspenseWrapper><ActivityPage /></SuspenseWrapper> },
      // Supply Chain routes
      { path: "/suppliers", element: <SuspenseWrapper><SuppliersPage /></SuspenseWrapper> },
      { path: "/inventory", element: <SuspenseWrapper><InventoryPage /></SuspenseWrapper> },
      { path: "/purchase-orders", element: <SuspenseWrapper><PurchaseOrdersPage /></SuspenseWrapper> },
      { path: "/material-ordering", element: <SuspenseWrapper><MaterialOrderingPage /></SuspenseWrapper> },
      // Tools and Utilities routes
      { path: "/calculators", element: <SuspenseWrapper><CalculatorsPage /></SuspenseWrapper> },
      // Workflow routes
      {
        path: "/workflow",
        children: [
          { index: true, element: <SuspenseWrapper><WorkflowPage /></SuspenseWrapper> },
          { path: "list", element: <SuspenseWrapper><WorkflowListPage /></SuspenseWrapper> },
          { path: "templates", element: <SuspenseWrapper><WorkflowTemplatesPage /></SuspenseWrapper> },
          { path: "metrics", element: <SuspenseWrapper><WorkflowMetricsPage /></SuspenseWrapper> },
        ],
      },
      { path: "/forms", element: <SuspenseWrapper><FormsPage /></SuspenseWrapper> },
      { path: "/tasks", element: <SuspenseWrapper><TasksPage /></SuspenseWrapper> },
      { path: "/ai-features", element: <SuspenseWrapper><AIFeaturesPage /></SuspenseWrapper> },
      { path: "/property-boundaries", element: <SuspenseWrapper><PropertyBoundariesPage /></SuspenseWrapper> },
      { path: "/networks", element: <SuspenseWrapper><NetworksPage /></SuspenseWrapper> },
      // Credentials route
      { path: "/credentials", element: <SuspenseWrapper><CredentialsPage /></SuspenseWrapper> },
      // Integrations (already handled under settings? Check original structure if needed)
      // { path: "/integrations", element: <SuspenseWrapper><IntegrationsPage /></SuspenseWrapper> },
    ]
  },
  // 404 Route - must be last
  {
    path: "*",
    element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>,
  },
];

// Create the browser router instance with the relativeSplatPath future flag
export const router = createBrowserRouter(routeObjects, {
  future: {
    v7_relativeSplatPath: true,
    // Add other future flags for createBrowserRouter here if needed
    // e.g., v7_fetcherPersist, v7_normalizeFormMethod, etc.
  }
});
