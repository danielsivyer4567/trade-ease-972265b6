import React, { Suspense } from 'react';
import { Route, RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// Import pages
const SettingsPage = React.lazy(() => import('@/pages/Settings'));
const NotificationsSettings = React.lazy(() => import('@/pages/Settings/Notifications'));
const AIFeaturesSettings = React.lazy(() => import('@/pages/Settings/AIFeatures'));
const DatabaseSettings = React.lazy(() => import('@/pages/Settings/Database'));
const AIAssistantSettings = React.lazy(() => import('@/pages/Settings/AIAssistantSettings'));
const TradeRatesPage = React.lazy(() => import('@/pages/Settings/TradeRates'));
const BillsPurchaseOrdersPage = React.lazy(() => import('@/pages/Settings/BillsPurchaseOrders'));
const OfficeStaffPage = React.lazy(() => import('@/pages/Settings/OfficeStaff'));
const ContractorsPage = React.lazy(() => import('@/pages/Settings/Contractors'));
const JobSettingsPage = React.lazy(() => import('@/pages/Settings/JobSettings'));
const TermsOfServicePage = React.lazy(() => import('@/pages/Settings/TermsOfService'));
const IntegrationsPage = React.lazy(() => import('@/pages/Settings/Integrations'));
const XeroCallback = React.lazy(() => import('@/pages/Settings/components/integrations/XeroCallback'));
const GenericSettingsPage = React.lazy(() => import('@/pages/Settings/GenericSettingsPage'));
const StaffPage = React.lazy(() => import('@/pages/Settings/Staff'));
const MessagingSettings = React.lazy(() => import('@/pages/Settings/MessagingSettings'));

// Export routes configuration
export const SettingsRoutes = (): RouteObject[] => [
  {
    path: "",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SettingsPage />
      </Suspense>
    ),
  },
  // Integration routes - keep specific routes before generic ones
  {
    path: "integrations",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <IntegrationsPage />
      </Suspense>
    ),
  },
  {
    path: "integrations/xero/callback",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <XeroCallback />
      </Suspense>
    ),
  },
  // Other specific settings routes
  {
    path: "notifications",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotificationsSettings />
      </Suspense>
    ),
  },
  {
    path: "messaging",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <MessagingSettings />
      </Suspense>
    ),
  },
  {
    path: "ai-features",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AIFeaturesSettings />
      </Suspense>
    ),
  },
  {
    path: "database",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <DatabaseSettings />
      </Suspense>
    ),
  },
  {
    path: "ai-assistant-settings",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AIAssistantSettings />
      </Suspense>
    ),
  },
  {
    path: "trade-rates",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <TradeRatesPage />
      </Suspense>
    ),
  },
  {
    path: "bills-purchase-orders",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <BillsPurchaseOrdersPage />
      </Suspense>
    ),
  },
  {
    path: "office-staff",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <OfficeStaffPage />
      </Suspense>
    ),
  },
  {
    path: "staff",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <StaffPage />
      </Suspense>
    ),
  },
  {
    path: "contractors",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ContractorsPage />
      </Suspense>
    ),
  },
  {
    path: "jobs",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <JobSettingsPage />
      </Suspense>
    ),
  },
  {
    path: "terms-of-service",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <TermsOfServicePage />
      </Suspense>
    ),
  },
  // Generic catch-all route should be last
  {
    path: ":settingType",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <GenericSettingsPage />
      </Suspense>
    ),
  },
];
