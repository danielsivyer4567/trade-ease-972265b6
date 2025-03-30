import React from 'react';
import { Route, Routes as RouterRoutes, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

// Import pages
const AuthPage = React.lazy(() => import('@/pages/Auth'));
const DashboardPage = React.lazy(() => import('@/pages/Index'));
const TradeDashPage = React.lazy(() => import('@/pages/TradeDash'));
const CalculatorsPage = React.lazy(() => import('@/pages/Calculators'));
const StatisticsPage = React.lazy(() => import('@/pages/Statistics'));
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

// New import for combined Quotes and Invoicing
const QuotesInvoicesPage = React.lazy(() => import('@/pages/QuotesInvoices'));

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
  // Fix property name from isLoading to loading to match AuthContext
  const { user, loading } = useAuth();

  // Simplified routing logic for demo
  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <RouterRoutes>
      {/* Auth Routes */}
      <Route path="/auth/*" element={user ? <Navigate to="/" /> : <AuthPage />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tradedash" element={<TradeDashPage />} />
        <Route path="/calculators/*" element={<CalculatorsPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/new" element={<NewCustomerPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/calendar/team/:teamColor" element={<TeamCalendarPage />} />
        <Route path="/calendar/sync" element={<CalendarSyncPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/new" element={<NewJobPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/email" element={<EmailPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/referrals" element={<ReferralsPage />} />
        <Route path="/database" element={<DatabasePage />} />
        <Route path="/quotes" element={<QuotesPage />} />
        <Route path="/quotes-invoices" element={<QuotesInvoicesPage />} />
        <Route path="/invoices/new" element={<NewInvoicePage />} />
        <Route path="/jobs/templates/new" element={<NewTemplatePage />} />
        <Route path="/messaging" element={<MessagingPage />} />
        
        {/* Settings Routes */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/notifications" element={<NotificationsSettings />} />
        <Route path="/settings/ai-assistant-settings" element={<AIAssistantSettings />} />
        <Route path="/settings/trade-rates" element={<TradeRatesPage />} />
        <Route path="/settings/bills-purchase-orders" element={<BillsPurchaseOrdersPage />} />
        <Route path="/settings/office-staff" element={<OfficeStaffPage />} />
        <Route path="/settings/contractors" element={<ContractorsPage />} />
        <Route path="/settings/jobs" element={<JobSettingsPage />} />
        <Route path="/settings/terms-of-service" element={<TermsOfServicePage />} />
        
        {/* Generic settings page for routes that don't have specific components */}
        <Route path="/settings/:settingType" element={<GenericSettingsPage />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </RouterRoutes>
  );
}
