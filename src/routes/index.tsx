import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouteObject, Outlet, Navigate, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingFallback } from './loading-fallback';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { authRoutes } from './auth-routes';
import { SettingsRoutes } from './settings-routes';
import { paymentRoutes } from './payment-routes';
import { financialRoutes } from './financial-routes';
import { activityRoutes } from './activity-routes';
import { AppLayoutWithTabs } from '@/components/AppLayoutWithTabs';
// Lazy load workflow pages
const WorkflowPage = lazy(() => import('@/pages/Workflow/index.new').then(module => ({ default: module.default })));
const WorkflowTemplates = lazy(() => import('@/pages/Workflow/templates').then(module => ({ default: module.default })));

// Development mode debugging component
const DevelopmentEntry = lazy(() => import('@/pages/DevelopmentEntry'));

// Lazy load main page components
const DashboardPage = lazy(() => import('@/pages/index'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

// Auth pages
const AuthPage = lazy(() => import('@/pages/Auth'));

// Customer related pages
const CustomersPage = lazy(() => import('@/pages/Customers/CustomersPage'));
const CustomerDetailsPage = lazy(() => import('@/pages/Customers/CustomerDetail'));
const NewCustomerPage = lazy(() => import('@/pages/Customers/NewCustomer'));

// Site Audits
const SiteAuditsPage = lazy(() => import('@/pages/SiteAudits'));

// Jobs
const JobsPage = lazy(() => import('@/pages/Jobs'));
const NewJobPage = lazy(() => import('@/pages/Jobs/NewJob'));
const JobDetailsPage = lazy(() => import('@/pages/Jobs/JobDetails'));

// Quotes and Invoices
const QuotesPage = lazy(() => import('@/pages/Quotes'));
const NewQuotePage = lazy(() => import('@/pages/Quotes/NewQuote'));

// Teams
const TeamRedPage = lazy(() => import('@/pages/TeamRed'));
const TeamBluePage = lazy(() => import('@/pages/TeamBlue'));
const TeamGreenPage = lazy(() => import('@/pages/TeamGreen'));
const TeamNewPage = lazy(() => import('@/pages/TeamNew'));
const TeamsPage = lazy(() => import('@/pages/Teams'));

// Calendar and Scheduling
const CalendarPage = lazy(() => import('@/pages/Calendar'));

// Workflow pages
const WorkflowList = lazy(() => import('@/pages/Workflow/WorkflowList'));
const EnrollmentHistory = lazy(() => import('@/pages/Workflow/EnrollmentHistory'));
const ExecutionLogs = lazy(() => import('@/pages/Workflow/ExecutionLogs'));
const AutomationsPage = lazy(() => import('@/pages/Automations').then(module => ({ default: module.default })));

// Communication
const EmailPage = lazy(() => import('@/pages/Email'));
const MessagingPage = lazy(() => import('@/pages/Messaging'));
const NotificationsPage = lazy(() => import('@/pages/Notifications'));

// Finance
const BankingPage = lazy(() => import('@/pages/Banking'));
const PaymentsPage = lazy(() => import('@/pages/Payments'));
const ExpensesPage = lazy(() => import('@/pages/Expenses'));

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
const FormsPage = lazy(() => import('@/pages/Forms'));
const TasksPage = lazy(() => import('@/pages/Tasks'));
const AIFeaturesPage = lazy(() => import('@/pages/AIFeatures'));
const PropertyBoundariesPage = lazy(() => import('@/pages/PropertyBoundaries'));
const NetworksPage = lazy(() => import('@/pages/Networks'));
const CredentialsPage = lazy(() => import('@/pages/Credentials'));
const JobCostCalculator = lazy(() => import('@/pages/Calculators/JobCostCalculator'));
const LoadsSpansCalculator = lazy(() => import('@/pages/Calculators/LoadsSpansCalculator'));
const FencingCalculator = lazy(() => import('@/pages/Calculators/FencingCalculator'));
const MarkupCalculator = lazy(() => import('@/pages/Calculators/MarkupCalculator'));
const NCCCodesCalculator = lazy(() => import('@/pages/Calculators/NCCCodesCalculator'));

// Settings
const SettingsPage = lazy(() => import('@/pages/Settings'));
const IntegrationsPage = lazy(() => import('@/pages/Integrations'));

// Helper component for Suspense boundary
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
);

// Get settings RouteObjects by calling the function
const settingsRouteObjects = SettingsRoutes();

// Define main application routes using RouteObject configuration
const routeObjects: RouteObject[] = [
  // Development Entry (only in dev mode)
  {
    path: "/dev",
    element: <Suspense fallback={<LoadingFallback />}><DevelopmentEntry /></Suspense>
  },
  // Auth Route as RouteObject
  authRoutes,
  {
    // Main App Layout with TabsProvider
    element: <AppLayoutWithTabs />,
    children: [
      {
        // Protected Routes Layout
        element: <ProtectedRoute />,
        children: [
          { path: "/", element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
          // Settings Routes
          {
            path: "settings", // Base path for settings
            children: settingsRouteObjects // Nest the objects returned by SettingsRoutes()
          },
          // Payment Routes
          paymentRoutes,
          // Financial Routes
          financialRoutes,
          // Activity Routes
          activityRoutes,
          // Customer routes
          {
            path: "/customers",
            children: [
              { index: true, element: <SuspenseWrapper><CustomersPage /></SuspenseWrapper> },
              { path: "new", element: <SuspenseWrapper><NewCustomerPage /></SuspenseWrapper> },
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
              { path: ":id", element: <SuspenseWrapper><JobDetailsPage /></SuspenseWrapper> },
              { path: ":id/detail", element: <SuspenseWrapper><JobDetailsPage /></SuspenseWrapper> },
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
          { path: "/calculators/markup", element: <SuspenseWrapper><MarkupCalculator /></SuspenseWrapper> },
          { path: "/calculators/job-cost", element: <SuspenseWrapper><JobCostCalculator /></SuspenseWrapper> },
          { path: "/calculators/loads-spans", element: <SuspenseWrapper><LoadsSpansCalculator /></SuspenseWrapper> },
          { path: "/calculators/fencing", element: <SuspenseWrapper><FencingCalculator /></SuspenseWrapper> },
          { path: "/calculators/ncc-codes", element: <SuspenseWrapper><NCCCodesCalculator /></SuspenseWrapper> },
          { path: "/workflow", element: <SuspenseWrapper><WorkflowPage /></SuspenseWrapper> },
          { path: "/workflow/new", element: <SuspenseWrapper><WorkflowPage /></SuspenseWrapper> },
          { path: "/workflow/edit/:id", element: <SuspenseWrapper><WorkflowPage /></SuspenseWrapper> },
          { path: "/workflow/list", element: <SuspenseWrapper><WorkflowList /></SuspenseWrapper> },
          { path: "/workflow/templates", element: <SuspenseWrapper><WorkflowTemplates /></SuspenseWrapper> },
          { path: "/workflow/enrollment-history", element: <SuspenseWrapper><EnrollmentHistory /></SuspenseWrapper> },
          { path: "/workflow/execution-logs", element: <SuspenseWrapper><ExecutionLogs /></SuspenseWrapper> },
          { path: "/workflow/automations", element: <SuspenseWrapper><AutomationsPage /></SuspenseWrapper> },
          { path: "/automations", element: <SuspenseWrapper><AutomationsPage /></SuspenseWrapper> },
          { path: "/forms", element: <SuspenseWrapper><FormsPage /></SuspenseWrapper> },
          { path: "/tasks", element: <SuspenseWrapper><TasksPage /></SuspenseWrapper> },
          { path: "/ai-features", element: <SuspenseWrapper><AIFeaturesPage /></SuspenseWrapper> },
          { path: "/property-boundaries", element: <SuspenseWrapper><PropertyBoundariesPage /></SuspenseWrapper> },
          { path: "/networks", element: <SuspenseWrapper><NetworksPage /></SuspenseWrapper> },
          // Credentials route
          { path: "/credentials", element: <SuspenseWrapper><CredentialsPage /></SuspenseWrapper> },
        ]
      }
    ]
  },
  // 404 Route - must be last
  {
    path: "*",
    element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>,
  },
];

// Create the browser router instance
export function createRouter() {
  // Using React Router v7.5.3+ which already includes the startTransition optimizations by default
  return createBrowserRouter(routeObjects);
}

// Create a singleton instance of the router
export const router = createRouter();
