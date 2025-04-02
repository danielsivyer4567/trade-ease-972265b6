import React, { Suspense } from 'react';
import { Route, Routes as RouterRoutes, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Import pages
const AuthPage = React.lazy(() => import('@/pages/Auth'));
const DashboardPage = React.lazy(() => import('@/pages/index'));
const TradeDashPage = React.lazy(() => import('@/pages/TradeDash'));
const CalculatorsPage = React.lazy(() => import('@/pages/Calculators'));
const StatisticsPage = React.lazy(() => import('@/pages/Statistics'));
const NetworksPage = React.lazy(() => import('@/pages/Networks'));
const CustomersPage = React.lazy(() => import('@/pages/Customers'));
const CustomerDetailPage = React.lazy(() => import('@/pages/Customers/CustomerDetail'));
const NewCustomerPage = React.lazy(() => import('@/pages/Customers/NewCustomer'));
const CalendarPage = React.lazy(() => import('@/pages/Calendar'));
const TeamCalendarPage = React.lazy(() => import('@/pages/Calendar/TeamCalendarPage'));
const CalendarSyncPage = React.lazy(() => import('@/pages/Calendar/CalendarSync'));
const JobsPage = React.lazy(() => import('@/pages/Jobs'));
const NewJobPage = React.lazy(() => import('@/pages/Jobs/NewJob'));
const JobDetailsPage = React.lazy(() => import('@/pages/Jobs/JobDetails').then(module => ({ default: module.JobDetails })));
const IntegrationsPage = React.lazy(() => import('@/pages/Integrations'));
const NotificationsPage = React.lazy(() => import('@/pages/Notifications'));
const EmailPage = React.lazy(() => import('@/pages/Email'));
const ReferralsPage = React.lazy(() => import('@/pages/Referrals'));
const DatabasePage = React.lazy(() => import('@/pages/Database'));
const QuotesPage = React.lazy(() => import('@/pages/Quotes'));
const NewTemplatePage = React.lazy(() => import('@/pages/Jobs/NewTemplate'));
const MessagingPage = React.lazy(() => import('@/pages/Messaging'));
const WorkflowPage = React.lazy(() => import('@/pages/Workflow'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFound'));
const TeamsPage = React.lazy(() => import('@/pages/Teams'));
const TeamRedPage = React.lazy(() => import('@/pages/TeamRed'));
const TeamBluePage = React.lazy(() => import('@/pages/TeamBlue'));
const TeamGreenPage = React.lazy(() => import('@/pages/TeamGreen'));
const TeamNewPage = React.lazy(() => import('@/pages/TeamNew'));
const SocialPage = React.lazy(() => import('@/pages/Social'));
const AIFeaturesPage = React.lazy(() => import('@/pages/AIFeatures'));
const SiteAuditsPage = React.lazy(() => import('@/pages/SiteAudits'));
const FormsPage = React.lazy(() => import('@/pages/Forms'));
const AutomationsPage = React.lazy(() => import('@/pages/Automations'));
const ActivityPage = React.lazy(() => import('@/pages/Activity'));
const PropertyBoundariesPage = React.lazy(() => import('@/pages/PropertyBoundaries'));
const BankingPage = React.lazy(() => import('@/pages/Banking'));

// New import for combined Quotes and Invoicing
const QuotesInvoicesPage = React.lazy(() => import('@/pages/QuotesInvoices'));
const NewInvoice = React.lazy(() => import('@/pages/Invoices/NewInvoice'));

// Settings Pages
const SettingsPage = React.lazy(() => import('@/pages/Settings'));
const NotificationsSettings = React.lazy(() => import('@/pages/Settings/Notifications'));
const AIAssistantSettings = React.lazy(() => import('@/pages/Settings/AIAssistantSettings'));
const TradeRatesPage = React.lazy(() => import('@/pages/Settings/TradeRates'));
const BillsPurchaseOrdersPage = React.lazy(() => import('@/pages/Settings/BillsPurchaseOrders'));
const OfficeStaffPage = React.lazy(() => import('@/pages/Settings/OfficeStaff'));
const ContractorsPage = React.lazy(() => import('@/pages/Settings/Contractors'));
const JobSettingsPage = React.lazy(() => import('@/pages/Settings/JobSettings'));
const TermsOfServicePage = React.lazy(() => import('@/pages/Settings/TermsOfService'));
const GenericSettingsPage = React.lazy(() => import('@/pages/Settings/GenericSettingsPage'));

export function Routes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterRoutes>
        {/* Auth Routes */}
        <Route path="/auth/*" element={user ? <Navigate to="/" /> : <AuthPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={
            <Suspense fallback={<LoadingFallback />}>
              <DashboardPage />
            </Suspense>
          } />
          <Route path="/tradedash" element={
            <Suspense fallback={<LoadingFallback />}>
              <TradeDashPage />
            </Suspense>
          } />
          <Route path="/calculators/*" element={
            <Suspense fallback={<LoadingFallback />}>
              <CalculatorsPage />
            </Suspense>
          } />
          <Route path="/statistics" element={
            <Suspense fallback={<LoadingFallback />}>
              <StatisticsPage />
            </Suspense>
          } />
          <Route path="/networks" element={
            <Suspense fallback={<LoadingFallback />}>
              <NetworksPage />
            </Suspense>
          } />
          <Route path="/customers" element={
            <Suspense fallback={<LoadingFallback />}>
              <CustomersPage />
            </Suspense>
          } />
          <Route path="/customers/new" element={
            <Suspense fallback={<LoadingFallback />}>
              <NewCustomerPage />
            </Suspense>
          } />
          <Route path="/customers/:id" element={
            <Suspense fallback={<LoadingFallback />}>
              <CustomerDetailPage />
            </Suspense>
          } />
          <Route path="/calendar" element={
            <Suspense fallback={<LoadingFallback />}>
              <CalendarPage />
            </Suspense>
          } />
          <Route path="/calendar/team/:teamColor" element={
            <Suspense fallback={<LoadingFallback />}>
              <TeamCalendarPage />
            </Suspense>
          } />
          <Route path="/calendar/sync" element={
            <Suspense fallback={<LoadingFallback />}>
              <CalendarSyncPage />
            </Suspense>
          } />
          <Route path="/jobs" element={
            <Suspense fallback={<LoadingFallback />}>
              <JobsPage />
            </Suspense>
          } />
          <Route path="/jobs/new" element={
            <Suspense fallback={<LoadingFallback />}>
              <NewJobPage />
            </Suspense>
          } />
          <Route path="/jobs/:id" element={
            <Suspense fallback={<LoadingFallback />}>
              <JobDetailsPage />
            </Suspense>
          } />
          <Route path="/integrations" element={
            <Suspense fallback={<LoadingFallback />}>
              <IntegrationsPage />
            </Suspense>
          } />
          <Route path="/email" element={
            <Suspense fallback={<LoadingFallback />}>
              <EmailPage />
            </Suspense>
          } />
          <Route path="/notifications" element={
            <Suspense fallback={<LoadingFallback />}>
              <NotificationsPage />
            </Suspense>
          } />
          <Route path="/referrals" element={
            <Suspense fallback={<LoadingFallback />}>
              <ReferralsPage />
            </Suspense>
          } />
          <Route path="/database" element={
            <Suspense fallback={<LoadingFallback />}>
              <DatabasePage />
            </Suspense>
          } />
          <Route path="/quotes" element={
            <Suspense fallback={<LoadingFallback />}>
              <QuotesPage />
            </Suspense>
          } />
          <Route path="/quotes-invoices" element={
            <Suspense fallback={<LoadingFallback />}>
              <QuotesInvoicesPage />
            </Suspense>
          } />
          <Route path="/invoices/new" element={
            <Suspense fallback={<LoadingFallback />}>
              <NewInvoice />
            </Suspense>
          } />
          <Route path="/jobs/templates/new" element={
            <Suspense fallback={<LoadingFallback />}>
              <NewTemplatePage />
            </Suspense>
          } />
          <Route path="/messaging" element={
            <Suspense fallback={<LoadingFallback />}>
              <MessagingPage />
            </Suspense>
          } />
          <Route path="/site-audits" element={
            <Suspense fallback={<LoadingFallback />}>
              <SiteAuditsPage />
            </Suspense>
          } />
          <Route path="/forms" element={
            <Suspense fallback={<LoadingFallback />}>
              <FormsPage />
            </Suspense>
          } />
          <Route path="/automations" element={
            <Suspense fallback={<LoadingFallback />}>
              <AutomationsPage />
            </Suspense>
          } />
          <Route path="/workflow" element={
            <Suspense fallback={<LoadingFallback />}>
              <WorkflowPage />
            </Suspense>
          } />
          <Route path="/activity" element={
            <Suspense fallback={<LoadingFallback />}>
              <ActivityPage />
            </Suspense>
          } />
          <Route path="/property-boundaries" element={
            <Suspense fallback={<LoadingFallback />}>
              <PropertyBoundariesPage />
            </Suspense>
          } />
          <Route path="/banking" element={
            <Suspense fallback={<LoadingFallback />}>
              <BankingPage />
            </Suspense>
          } />
          
          {/* Settings Routes */}
          <Route path="/settings" element={
            <Suspense fallback={<LoadingFallback />}>
              <SettingsPage />
            </Suspense>
          } />
          <Route path="/settings/notifications" element={
            <Suspense fallback={<LoadingFallback />}>
              <NotificationsSettings />
            </Suspense>
          } />
          <Route path="/settings/ai-assistant-settings" element={
            <Suspense fallback={<LoadingFallback />}>
              <AIAssistantSettings />
            </Suspense>
          } />
          <Route path="/settings/trade-rates" element={
            <Suspense fallback={<LoadingFallback />}>
              <TradeRatesPage />
            </Suspense>
          } />
          <Route path="/settings/bills-purchase-orders" element={
            <Suspense fallback={<LoadingFallback />}>
              <BillsPurchaseOrdersPage />
            </Suspense>
          } />
          <Route path="/settings/office-staff" element={
            <Suspense fallback={<LoadingFallback />}>
              <OfficeStaffPage />
            </Suspense>
          } />
          <Route path="/settings/contractors" element={
            <Suspense fallback={<LoadingFallback />}>
              <ContractorsPage />
            </Suspense>
          } />
          <Route path="/settings/jobs" element={
            <Suspense fallback={<LoadingFallback />}>
              <JobSettingsPage />
            </Suspense>
          } />
          <Route path="/settings/terms-of-service" element={
            <Suspense fallback={<LoadingFallback />}>
              <TermsOfServicePage />
            </Suspense>
          } />
          
          {/* Generic settings page for routes that don't have specific components */}
          <Route path="/settings/:settingType" element={
            <Suspense fallback={<LoadingFallback />}>
              <GenericSettingsPage />
            </Suspense>
          } />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={
          <Suspense fallback={<LoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        } />
      </RouterRoutes>
    </Suspense>
  );
}
