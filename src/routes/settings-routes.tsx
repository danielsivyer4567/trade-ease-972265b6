
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Import pages
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

export const SettingsRoutes = () => {
  return (
    <Route element={<ProtectedRoute />}>
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
      <Route path="/settings/:settingType" element={
        <Suspense fallback={<LoadingFallback />}>
          <GenericSettingsPage />
        </Suspense>
      } />
    </Route>
  );
};
