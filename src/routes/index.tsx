import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouteObject, Outlet } from 'react-router-dom';
import { LoadingFallback } from './loading-fallback';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { authRoutes } from './auth-routes';
import { SettingsRoutes } from './settings-routes';
import { paymentRoutes } from './payment-routes';
import { activityRoutes } from './activity-routes';
import { AppLayoutWithTabs } from '@/components/AppLayoutWithTabs';
import { apiRoutes } from './api-routes';
import { AuthDebugger } from '@/components/debug/AuthDebugger';
import FenceCalculatorPage from '@/pages/Calculators/FenceCalculatorPage';

// Helper component for Suspense boundary
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
);

// Lazy load main page components
const DashboardPage = lazy(() => import('@/pages/index'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));
const CustomersPage = lazy(() => import('@/pages/Customers/index').then(module => ({ default: module.default })));
const CustomerDetailsPage = lazy(() => import('@/pages/Customers/CustomerDetail'));
const NewCustomerPage = lazy(() => import('@/pages/Customers/NewCustomer'));
const EditCustomerPage = lazy(() => import('@/pages/Customers/EditCustomer'));
const CustomerPortfolioPage = lazy(() => import('@/pages/Customers/CustomerPortfolio'));
const SiteAuditsPage = lazy(() => import('@/pages/SiteAudits'));
const NewSiteAuditPage = lazy(() => import('@/pages/SiteAudits/New'));
const SiteAuditDetailsPage = lazy(() => import('@/pages/SiteAudits/Details'));
const JobsPage = lazy(() => import('@/pages/Jobs'));
const NewJobPage = lazy(() => import('@/pages/Jobs/NewJob'));
const JobDetailsPage = lazy(() => import('@/pages/Jobs/JobDetails'));
const QuotesPage = lazy(() => import('@/pages/Quotes'));
const NewQuotePage = lazy(() => import('@/pages/Quotes/NewQuote'));
const InvoicesPage = lazy(() => import('@/pages/Invoices'));
const NewInvoicePage = lazy(() => import('@/pages/Invoices/NewInvoice'));
const InvoiceDetailPage = lazy(() => import('@/pages/Invoices/InvoiceDetail'));
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
const SuppliersPage = lazy(() => import('@/pages/Suppliers'));
const InventoryPage = lazy(() => import('@/pages/Inventory'));
const PurchaseOrdersPage = lazy(() => import('@/pages/PurchaseOrders'));
const MaterialOrderingPage = lazy(() => import('@/pages/MaterialOrdering'));
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
const TDSCalculator = lazy(() => import('@/pages/Calculators/TDSCalculator'));
const QBCCFormsCalculator = lazy(() => import('@/pages/Calculators/QBCCFormsCalculator'));
const N8nWorkflowPage = lazy(() => import('@/pages/Workflow/n8n-workflow'));
const N8nWorkflowListPage = lazy(() => import('@/pages/Workflow/n8n-workflow-list'));

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
          {
            path: "settings/*", // Use '/*' for nested routes
            element: <SettingsRoutes />
          },
          ...(paymentRoutes.children || []),
          activityRoutes,
          {
            path: "customers",
            children: [
              { index: true, element: <SuspenseWrapper><CustomersPage /></SuspenseWrapper> },
              { path: "new", element: <SuspenseWrapper><NewCustomerPage /></SuspenseWrapper> },
              { path: ":id", element: <SuspenseWrapper><CustomerPortfolioPage /></SuspenseWrapper> },
              { path: ":id/details", element: <SuspenseWrapper><CustomerDetailsPage /></SuspenseWrapper> },
              { path: ":id/edit", element: <SuspenseWrapper><EditCustomerPage /></SuspenseWrapper> },
            ],
          },
          {
            path: "site-audits",
            children: [
              { index: true, element: <SuspenseWrapper><SiteAuditsPage /></SuspenseWrapper> },
              { path: "new", element: <SuspenseWrapper><NewSiteAuditPage /></SuspenseWrapper> },
              { path: ":id", element: <SuspenseWrapper><SiteAuditDetailsPage /></SuspenseWrapper> },
            ],
          },
          {
            path: "jobs",
            children: [
              { index: true, element: <SuspenseWrapper><JobsPage /></SuspenseWrapper> },
              { path: "new", element: <SuspenseWrapper><NewJobPage /></SuspenseWrapper> },
              { path: ":id", element: <SuspenseWrapper><JobDetailsPage /></SuspenseWrapper> },
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
            children: [
              { index: true, element: <SuspenseWrapper><InvoicesPage /></SuspenseWrapper> },
              { path: "new", element: <SuspenseWrapper><NewInvoicePage /></SuspenseWrapper> },
              { path: ":id", element: <SuspenseWrapper><InvoiceDetailPage /></SuspenseWrapper> },
            ],
          },
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
        ]
      }
    ]
  },
  {
    path: "*",
    element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>,
  },
];

export const router = createBrowserRouter(routeObjects);
