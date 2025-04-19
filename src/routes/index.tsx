import React, { Suspense, lazy } from 'react';
import { Routes as RouterRoutes, Route, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingFallback } from './loading-fallback';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { authRoutes } from './auth-routes';
import { SettingsRoutes } from './settings-routes';

// Lazy load main page components
const DashboardPage = lazy(() => import('@/pages/index'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

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
const FormsPage = lazy(() => import('@/pages/Forms'));
const TasksPage = lazy(() => import('@/pages/Tasks'));
const AIFeaturesPage = lazy(() => import('@/pages/AIFeatures'));
const PropertyBoundariesPage = lazy(() => import('@/pages/PropertyBoundaries'));
const NetworksPage = lazy(() => import('@/pages/Networks'));

// Settings
const SettingsPage = lazy(() => import('@/pages/Settings'));
const IntegrationsPage = lazy(() => import('@/pages/Integrations'));

export function Routes() {
  const { user, loading } = useAuth();
  const settingsRoutes = SettingsRoutes();

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterRoutes>
        {/* Auth routes */}
        {authRoutes}

        <Route element={<ProtectedRoute />}>
          {/* Root route - main dashboard */}
          <Route path="/" element={
            <Suspense fallback={<LoadingFallback />}>
              <DashboardPage />
            </Suspense>
          } />
          
          {/* Settings routes */}
          <Route path="settings/*">
            {settingsRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
          
          {/* Customer routes */}
          <Route path="/customers">
            <Route index element={
              <Suspense fallback={<LoadingFallback />}>
                <CustomersPage />
              </Suspense>
            } />
            <Route path=":auditId" element={
              <Suspense fallback={<LoadingFallback />}>
                <CustomersPage />
              </Suspense>
            } />
            <Route path=":auditId/:customerId" element={
              <Suspense fallback={<LoadingFallback />}>
                <CustomerDetailsPage />
              </Suspense>
            } />
          </Route>
          
          {/* Site Audits routes */}
          <Route path="/site-audits">
            <Route index element={
              <Suspense fallback={<LoadingFallback />}>
                <SiteAuditsPage />
              </Suspense>
            } />
            <Route path="new" element={
              <Suspense fallback={<LoadingFallback />}>
                <SiteAuditsPage />
              </Suspense>
            } />
          </Route>
          
          {/* Job routes */}
          <Route path="/job" element={
            <Suspense fallback={<LoadingFallback />}>
              <JobsPage />
            </Suspense>
          } />
          
          <Route path="/jobs">
            <Route index element={
              <Suspense fallback={<LoadingFallback />}>
                <JobsPage />
              </Suspense>
            } />
            <Route path="new" element={
              <Suspense fallback={<LoadingFallback />}>
                <NewJobPage />
              </Suspense>
            } />
          </Route>
          
          {/* Quote and Invoice routes */}
          <Route path="/quote" element={
            <Suspense fallback={<LoadingFallback />}>
              <QuotesPage />
            </Suspense>
          } />
          
          <Route path="/quotes">
            <Route index element={
              <Suspense fallback={<LoadingFallback />}>
                <QuotesPage />
              </Suspense>
            } />
            {/* 
            <Route path=":quoteId" element={
              <Suspense fallback={<LoadingFallback />}>
                <QuoteDetailsPage />
              </Suspense>
            } />
            */}
          </Route>
          
          {/* 
          <Route path="/invoices" element={
            <Suspense fallback={<LoadingFallback />}>
              <InvoicesPage />
            </Suspense>
          } />
          */}
          
          {/* Team routes */}
          <Route path="/teams" element={
            <Suspense fallback={<LoadingFallback />}>
              <TeamsPage />
            </Suspense>
          } />
          
          <Route path="/team-red" element={
            <Suspense fallback={<LoadingFallback />}>
              <TeamRedPage />
            </Suspense>
          } />
          
          <Route path="/team-blue" element={
            <Suspense fallback={<LoadingFallback />}>
              <TeamBluePage />
            </Suspense>
          } />
          
          <Route path="/team-green" element={
            <Suspense fallback={<LoadingFallback />}>
              <TeamGreenPage />
            </Suspense>
          } />
          
          <Route path="/team-new" element={
            <Suspense fallback={<LoadingFallback />}>
              <TeamNewPage />
            </Suspense>
          } />
          
          {/* Calendar route */}
          <Route path="/calendar" element={
            <Suspense fallback={<LoadingFallback />}>
              <CalendarPage />
            </Suspense>
          } />
          
          {/* Communication routes */}
          <Route path="/email" element={
            <Suspense fallback={<LoadingFallback />}>
              <EmailPage />
            </Suspense>
          } />
          
          <Route path="/messaging" element={
            <Suspense fallback={<LoadingFallback />}>
              <MessagingPage />
            </Suspense>
          } />
          
          <Route path="/notifications" element={
            <Suspense fallback={<LoadingFallback />}>
              <NotificationsPage />
            </Suspense>
          } />
          
          {/* Finance routes */}
          <Route path="/banking" element={
            <Suspense fallback={<LoadingFallback />}>
              <BankingPage />
            </Suspense>
          } />
          
          <Route path="/payments" element={
            <Suspense fallback={<LoadingFallback />}>
              <PaymentsPage />
            </Suspense>
          } />
          
          <Route path="/expenses" element={
            <Suspense fallback={<LoadingFallback />}>
              <ExpensesPage />
            </Suspense>
          } />
          
          {/* 
          <Route path="/payroll" element={
            <Suspense fallback={<LoadingFallback />}>
              <PayrollPage />
            </Suspense>
          } />
          */}
          
          {/* Trading routes */}
          <Route path="/trading" element={
            <Suspense fallback={<LoadingFallback />}>
              <TradingPage />
            </Suspense>
          } />
          
          <Route path="/tradedash" element={
            <Suspense fallback={<LoadingFallback />}>
              <TradeDashPage />
            </Suspense>
          } />
          
          {/* Reporting routes */}
          <Route path="/statistics" element={
            <Suspense fallback={<LoadingFallback />}>
              <StatisticsPage />
            </Suspense>
          } />
          
          <Route path="/performance" element={
            <Suspense fallback={<LoadingFallback />}>
              <PerformancePage />
            </Suspense>
          } />
          
          <Route path="/activity" element={
            <Suspense fallback={<LoadingFallback />}>
              <ActivityPage />
            </Suspense>
          } />
          
          {/* Supply Chain routes */}
          <Route path="/suppliers" element={
            <Suspense fallback={<LoadingFallback />}>
              <SuppliersPage />
            </Suspense>
          } />
          
          <Route path="/inventory" element={
            <Suspense fallback={<LoadingFallback />}>
              <InventoryPage />
            </Suspense>
          } />
          
          <Route path="/purchase-orders" element={
            <Suspense fallback={<LoadingFallback />}>
              <PurchaseOrdersPage />
            </Suspense>
          } />
          
          <Route path="/material-ordering" element={
            <Suspense fallback={<LoadingFallback />}>
              <MaterialOrderingPage />
            </Suspense>
          } />
          
          {/* Tools and Utilities routes */}
          <Route path="/calculators" element={
            <Suspense fallback={<LoadingFallback />}>
              <CalculatorsPage />
            </Suspense>
          } />
          
          <Route path="/workflow" element={
            <Suspense fallback={<LoadingFallback />}>
              <WorkflowPage />
            </Suspense>
          } />
          
          <Route path="/forms" element={
            <Suspense fallback={<LoadingFallback />}>
              <FormsPage />
            </Suspense>
          } />
          
          <Route path="/tasks" element={
            <Suspense fallback={<LoadingFallback />}>
              <TasksPage />
            </Suspense>
          } />
          
          <Route path="/ai-features" element={
            <Suspense fallback={<LoadingFallback />}>
              <AIFeaturesPage />
            </Suspense>
          } />
          
          <Route path="/property-boundaries" element={
            <Suspense fallback={<LoadingFallback />}>
              <PropertyBoundariesPage />
            </Suspense>
          } />
          
          <Route path="/networks" element={
            <Suspense fallback={<LoadingFallback />}>
              <NetworksPage />
            </Suspense>
          } />
          
          {/* Settings and Integrations */}
          <Route path="/settings" element={
            <Suspense fallback={<LoadingFallback />}>
              <SettingsPage />
            </Suspense>
          } />
          
          <Route path="/integrations" element={
            <Suspense fallback={<LoadingFallback />}>
              <IntegrationsPage />
            </Suspense>
          } />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={
          <Suspense fallback={<LoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        } />
      </RouterRoutes>
    </Suspense>
  );
}
