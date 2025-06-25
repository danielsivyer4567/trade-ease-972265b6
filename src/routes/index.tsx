import React, { Suspense, lazy } from 'react';
<<<<<<< HEAD
import { createBrowserRouter, RouteObject } from 'react-router-dom';
=======
import { createBrowserRouter, createRoutesFromElements, RouteObject, Outlet, Navigate, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
import { LoadingFallback } from './loading-fallback';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { authRoutes } from './auth-routes';
import { SettingsRoutes } from './settings-routes';
import { paymentRoutes } from './payment-routes';
<<<<<<< HEAD
=======
import { financialRoutes } from './financial-routes';
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
import { activityRoutes } from './activity-routes';
import { AppLayoutWithTabs } from '@/components/AppLayoutWithTabs';
import { apiRoutes } from './api-routes';
import { AuthDebugger } from '@/components/debug/AuthDebugger';
<<<<<<< HEAD
import FenceCalculatorPage from '@/pages/Calculators/FenceCalculatorPage';

// Helper component for Suspense boundary
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
);
=======

// Lazy load n8n workflow pages (replacing custom workflow components)
const N8nWorkflowPage = lazy(() => import('@/pages/Workflow/n8n-workflow'));
const N8nWorkflowListPage = lazy(() => import('@/pages/Workflow/n8n-workflow-list'));

// Development mode debugging component
const DevelopmentEntry = lazy(() => import('@/pages/DevelopmentEntry'));
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7

// Lazy load main page components
const DashboardPage = lazy(() => import('@/pages/index'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));
<<<<<<< HEAD
=======
const DebugMapsPage = lazy(() => import('@/pages/debug-maps'));
const TestMapsPage = lazy(() => import('@/pages/test-maps'));
const GoogleCloudFixPage = lazy(() => import('@/pages/google-cloud-fix'));
const TestGoogleMapsPage = lazy(() => import('@/pages/TestGoogleMaps'));

// Workflow Dashboard
const WorkflowDashboard = lazy(() => import('@/components/workflow/WorkflowDashboard').then(module => ({ default: module.default })));

// Auth pages
const AuthPage = lazy(() => import('@/pages/Auth'));

// Customer related pages
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
const CustomersPage = lazy(() => import('@/pages/Customers/index').then(module => ({ default: module.default })));
const CustomerDetailsPage = lazy(() => import('@/pages/Customers/CustomerDetail'));
const NewCustomerPage = lazy(() => import('@/pages/Customers/NewCustomer'));
const EditCustomerPage = lazy(() => import('@/pages/Customers/EditCustomer'));
const CustomerPortfolioPage = lazy(() => import('@/pages/Customers/CustomerPortfolio'));
<<<<<<< HEAD
const SiteAuditsPage = lazy(() => import('@/pages/SiteAudits'));
const JobsPage = lazy(() => import('@/pages/Jobs'));
const NewJobPage = lazy(() => import('@/pages/Jobs/NewJob'));
const JobDetailsPage = lazy(() => import('@/pages/Jobs/JobDetails'));
=======

// Site Audits
const SiteAuditsPage = lazy(() => import('@/pages/SiteAudits'));

// Jobs
const JobsPage = lazy(() => import('@/pages/Jobs'));
const NewJobPage = lazy(() => import('@/pages/Jobs/NewJob'));
const JobDetailsPage = lazy(() => import('@/pages/Jobs/JobDetails'));

// Quotes and Invoices
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
const QuotesPage = lazy(() => import('@/pages/Quotes'));
const NewQuotePage = lazy(() => import('@/pages/Quotes/NewQuote'));
const InvoicesPage = lazy(() => import('@/pages/Invoices'));
const NewInvoicePage = lazy(() => import('@/pages/Invoices/NewInvoice'));
const InvoiceDetailPage = lazy(() => import('@/pages/Invoices/InvoiceDetail'));
<<<<<<< HEAD
const TeamsPage = lazy(() => import('@/pages/Teams'));
const CalendarPage = lazy(() => import('@/pages/Calendar'));
const AutomationsPage = lazy(() => import('@/pages/Automations').then(module => ({ default: module.default })));
const EmailPage = lazy(() => import('@/pages/Email'));
const MessagingPage = lazy(() => import('@/pages/Messaging'));
const NotificationsPage = lazy(() => import('@/pages/Notifications'));
const BankingPage = lazy(() => import('@/pages/Banking'));
const ExpensesPage = lazy(() => import('@/pages/Expenses'));
const TradingPage = lazy(() => import('@/pages/Trading'));
const TradeDashPage = lazy(() => import('@/pages/TradeDash'));
const StatisticsPage = lazy(() => import('@/pages/Statistics'));
const PerformancePage = lazy(() => import('@/pages/Performance'));
=======

// Teams
const TeamRedPage = lazy(() => import('@/pages/TeamRed'));
const TeamBluePage = lazy(() => import('@/pages/TeamBlue'));
const TeamGreenPage = lazy(() => import('@/pages/TeamGreen'));
const TeamNewPage = lazy(() => import('@/pages/TeamNew'));
const TeamsPage = lazy(() => import('@/pages/Teams'));

// Calendar and Scheduling
const CalendarPage = lazy(() => import('@/pages/Calendar'));

// Keep automation page for now (can be replaced with n8n later if needed)
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
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
const SuppliersPage = lazy(() => import('@/pages/Suppliers'));
const InventoryPage = lazy(() => import('@/pages/Inventory'));
const PurchaseOrdersPage = lazy(() => import('@/pages/PurchaseOrders'));
const MaterialOrderingPage = lazy(() => import('@/pages/MaterialOrdering'));
<<<<<<< HEAD
=======

// Tools and Utilities
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
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
<<<<<<< HEAD
const TDSCalculator = lazy(() => import('@/pages/Calculators/TDSCalculator'));
const QBCCFormsCalculator = lazy(() => import('@/pages/Calculators/QBCCFormsCalculator'));
const N8nWorkflowPage = lazy(() => import('@/pages/Workflow/n8n-workflow'));
const N8nWorkflowListPage = lazy(() => import('@/pages/Workflow/n8n-workflow-list'));
const GoogleMapsTest = lazy(() => import('@/pages/GoogleMapsTest'));

const routeObjects: RouteObject[] = [
  apiRoutes,
  authRoutes,
  {
    element: <AppLayoutWithTabs />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/", element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
          ...SettingsRoutes(),
          ...(paymentRoutes.children || []),
          activityRoutes,
          {
            path: "customers",
=======

// Demo pages
const AnimatedStageDemo = lazy(() => import('@/pages/AnimatedStageDemo'));

// Settings
const SettingsPage = lazy(() => import('@/pages/Settings'));
const IntegrationsPage = lazy(() => import('@/pages/Integrations'));

// Import SetupDatabasePage
import SetupDatabasePage from "@/pages/Settings/integrations/database/SetupDatabasePage";

// Helper component for Suspense boundary
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
);

// Get settings RouteObjects by calling the function
const settingsRouteObjects = SettingsRoutes();

// Define main application routes using RouteObject configuration
const routeObjects: RouteObject[] = [
  // Test route for debugging
  {
    path: "/test",
    element: <div style={{ padding: '20px' }}>Test Route Working!</div>
  },
  // Health check route
  {
    path: "/health",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <div style={{ padding: '20px' }}>
          <SuspenseWrapper>
            {React.createElement(React.lazy(() => import('@/components/health/AppHealthCheck').then(module => ({ default: module.AppHealthCheck }))))}
          </SuspenseWrapper>
        </div>
      </Suspense>
    )
  },
  // Development Entry (only in dev mode)
  {
    path: "/dev",
    element: <Suspense fallback={<LoadingFallback />}><DevelopmentEntry /></Suspense>
  },
  // Debug route for authentication
  {
    path: "/debug/auth",
    element: <Suspense fallback={<LoadingFallback />}><AuthDebugger /></Suspense>
  },
  // API Routes
  apiRoutes,
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
          // Payment Routes (spread the children since it's a RouteObject with children)
          ...(paymentRoutes.children || []),
          // Financial Routes - commented out as it's JSX, not RouteObject
          // financialRoutes,
          // Activity Routes (spread as a single object in array)
          activityRoutes,
          // Customer routes
          {
            path: "/customers",
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
            children: [
              { index: true, element: <SuspenseWrapper><CustomersPage /></SuspenseWrapper> },
              { path: "new", element: <SuspenseWrapper><NewCustomerPage /></SuspenseWrapper> },
              { path: ":id", element: <SuspenseWrapper><CustomerPortfolioPage /></SuspenseWrapper> },
              { path: ":id/details", element: <SuspenseWrapper><CustomerDetailsPage /></SuspenseWrapper> },
              { path: ":id/edit", element: <SuspenseWrapper><EditCustomerPage /></SuspenseWrapper> },
            ],
          },
<<<<<<< HEAD
          {
            path: "site-audits",
            element: <SuspenseWrapper><SiteAuditsPage /></SuspenseWrapper>
          },
          {
            path: "jobs",
=======
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
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
            children: [
              { index: true, element: <SuspenseWrapper><JobsPage /></SuspenseWrapper> },
              { path: "new", element: <SuspenseWrapper><NewJobPage /></SuspenseWrapper> },
              { path: ":id", element: <SuspenseWrapper><JobDetailsPage /></SuspenseWrapper> },
<<<<<<< HEAD
            ],
          },
          {
            path: "quotes",
            children: [
              { index: true, element: <SuspenseWrapper><QuotesPage /></SuspenseWrapper> },
              { path: "new", element: <SuspenseWrapper><NewQuotePage /></SuspenseWrapper> },
            ],
          },
          {
            path: "invoices",
=======
              { path: ":id/detail", element: <SuspenseWrapper><JobDetailsPage /></SuspenseWrapper> },
            ],
          },
          // Quote routes
          { path: "/quote", element: <SuspenseWrapper><QuotesPage /></SuspenseWrapper> },
          {
            path: "/quotes",
            children: [
              { index: true, element: <SuspenseWrapper><QuotesPage /></SuspenseWrapper> },
              { path: "empty", element: <SuspenseWrapper><QuotesPage /></SuspenseWrapper> },
              { path: "new", element: <SuspenseWrapper><NewQuotePage /></SuspenseWrapper> },
            ],
          },
          // Invoices routes
          {
            path: "/invoices",
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
            children: [
              { index: true, element: <SuspenseWrapper><InvoicesPage /></SuspenseWrapper> },
              { path: "new", element: <SuspenseWrapper><NewInvoicePage /></SuspenseWrapper> },
              { path: ":id", element: <SuspenseWrapper><InvoiceDetailPage /></SuspenseWrapper> },
            ],
          },
<<<<<<< HEAD
          { path: "teams", element: <SuspenseWrapper><TeamsPage /></SuspenseWrapper> },
          { path: "calendar", element: <SuspenseWrapper><CalendarPage /></SuspenseWrapper> },
          { path: "email", element: <SuspenseWrapper><EmailPage /></SuspenseWrapper> },
          { path: "messaging", element: <SuspenseWrapper><MessagingPage /></SuspenseWrapper> },
          { path: "notifications", element: <SuspenseWrapper><NotificationsPage /></SuspenseWrapper> },
          { path: "banking", element: <SuspenseWrapper><BankingPage /></SuspenseWrapper> },
          { path: "expenses", element: <SuspenseWrapper><ExpensesPage /></SuspenseWrapper> },
          { path: "trading", element: <SuspenseWrapper><TradingPage /></SuspenseWrapper> },
          { path: "tradedash", element: <SuspenseWrapper><TradeDashPage /></SuspenseWrapper> },
          { path: "statistics", element: <SuspenseWrapper><StatisticsPage /></SuspenseWrapper> },
          { path: "performance", element: <SuspenseWrapper><PerformancePage /></SuspenseWrapper> },
          { path: "suppliers", element: <SuspenseWrapper><SuppliersPage /></SuspenseWrapper> },
          { path: "inventory", element: <SuspenseWrapper><InventoryPage /></SuspenseWrapper> },
          { path: "purchase-orders", element: <SuspenseWrapper><PurchaseOrdersPage /></SuspenseWrapper> },
          { path: "material-ordering", element: <SuspenseWrapper><MaterialOrderingPage /></SuspenseWrapper> },
          {
            path: "calculators",
            children: [
                { index: true, element: <SuspenseWrapper><CalculatorsPage /></SuspenseWrapper>},
                { path: "markup", element: <SuspenseWrapper><MarkupCalculator /></SuspenseWrapper> },
                { path: "job-cost", element: <SuspenseWrapper><JobCostCalculator /></SuspenseWrapper> },
                { path: "loads-spans", element: <SuspenseWrapper><LoadsSpansCalculator /></SuspenseWrapper> },
                { path: "fencing", element: <SuspenseWrapper><FencingCalculator /></SuspenseWrapper> },
                { path: "ncc-codes", element: <SuspenseWrapper><NCCCodesCalculator /></SuspenseWrapper> },
                { path: "tds", element: <SuspenseWrapper><TDSCalculator /></SuspenseWrapper> },
                { path: "qbcc-forms", element: <SuspenseWrapper><QBCCFormsCalculator /></SuspenseWrapper> },
                { path: "fence", element: <SuspenseWrapper><FenceCalculatorPage /></SuspenseWrapper> },
            ]
          },
          { path: "automations", element: <SuspenseWrapper><AutomationsPage /></SuspenseWrapper> },
          { path: "forms", element: <SuspenseWrapper><FormsPage /></SuspenseWrapper> },
          { path: "tasks", element: <SuspenseWrapper><TasksPage /></SuspenseWrapper> },
          { path: "ai-features", element: <SuspenseWrapper><AIFeaturesPage /></SuspenseWrapper> },
          { path: "property-boundaries", element: <SuspenseWrapper><PropertyBoundariesPage /></SuspenseWrapper> },
          { path: "networks", element: <SuspenseWrapper><NetworksPage /></SuspenseWrapper> },
          { path: "credentials", element: <SuspenseWrapper><CredentialsPage /></SuspenseWrapper> },
          { path: "workflow/list", element: <SuspenseWrapper><N8nWorkflowListPage /></SuspenseWrapper> },
          { path: "workflow/new", element: <SuspenseWrapper><N8nWorkflowPage /></SuspenseWrapper> },
          { path: "workflow/edit/:id", element: <SuspenseWrapper><N8nWorkflowPage /></SuspenseWrapper> },
          { path: "debug/auth", element: <AuthDebugger /> },
          { path: "debug/google-maps", element: <SuspenseWrapper><GoogleMapsTest /></SuspenseWrapper> },
=======
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
          { path: "/workflow", element: <SuspenseWrapper><N8nWorkflowListPage /></SuspenseWrapper> },
          { path: "/workflow/new", element: <SuspenseWrapper><N8nWorkflowPage /></SuspenseWrapper> },
          { path: "/workflow/edit/:id", element: <SuspenseWrapper><N8nWorkflowPage /></SuspenseWrapper> },
          { path: "/workflow/list", element: <SuspenseWrapper><N8nWorkflowListPage /></SuspenseWrapper> },
          { path: "/workflow/automations", element: <SuspenseWrapper><AutomationsPage /></SuspenseWrapper> },
          { path: "/workflow/dashboard", element: <SuspenseWrapper><WorkflowDashboard /></SuspenseWrapper> },
          { path: "/automations", element: <SuspenseWrapper><AutomationsPage /></SuspenseWrapper> },
          { path: "/forms", element: <SuspenseWrapper><FormsPage /></SuspenseWrapper> },
          { path: "/tasks", element: <SuspenseWrapper><TasksPage /></SuspenseWrapper> },
          { path: "/ai-features", element: <SuspenseWrapper><AIFeaturesPage /></SuspenseWrapper> },
          { path: "/property-boundaries", element: <SuspenseWrapper><PropertyBoundariesPage /></SuspenseWrapper> },
          { path: "/networks", element: <SuspenseWrapper><NetworksPage /></SuspenseWrapper> },
          // Credentials route
          { path: "/credentials", element: <SuspenseWrapper><CredentialsPage /></SuspenseWrapper> },
          // Debug Maps route
          { path: "/debug-maps", element: <SuspenseWrapper><DebugMapsPage /></SuspenseWrapper> },
          // Test Maps route
          { path: "/test-maps", element: <SuspenseWrapper><TestMapsPage /></SuspenseWrapper> },
          // Google Cloud Fix route
          { path: "/google-cloud-fix", element: <SuspenseWrapper><GoogleCloudFixPage /></SuspenseWrapper> },
          // Test Google Maps API route
          { path: "/test-google-maps", element: <SuspenseWrapper><TestGoogleMapsPage /></SuspenseWrapper> },
          // Animated Stage Demo route
          { path: "/animated-stage-demo", element: <SuspenseWrapper><AnimatedStageDemo /></SuspenseWrapper> },
          // Add the route to the settings routes
          {
            path: "/settings/integrations/database",
            element: <SetupDatabasePage />,
          },
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
        ]
      }
    ]
  },
<<<<<<< HEAD
=======
  // 404 Route - must be last
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
  {
    path: "*",
    element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>,
  },
];

<<<<<<< HEAD
export const router = createBrowserRouter(routeObjects);
=======
// Create the browser router instance
export function createRouter() {
  // Using React Router v7.5.3+ which already includes the startTransition optimizations by default
  return createBrowserRouter(routeObjects);
}

// Create a singleton instance of the router
export const router = createRouter();
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
