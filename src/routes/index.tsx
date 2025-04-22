import React, { Suspense, ReactNode, lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouteObject, Navigate, Route } from 'react-router-dom';
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

interface AppRoute {
  path: string;
  element: ReactNode;
}

// CRITICAL: This routing configuration ONLY uses actual implemented components 
// NO stub pages are used, ensuring full functionality of the application

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

// Lazy load invoice pages
const InvoicesPage = lazy(() => import('../pages/Invoices'));
const NewInvoice = lazy(() => import('../pages/Invoices/NewInvoice'));
const InvoiceDetail = lazy(() => import('../pages/Invoices/InvoiceDetail'));

// Lazy load settings pages
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));
const SettingsPageTemplate = lazy(() => import('../pages/Settings/SettingsPageTemplate'));

// Helper component to wrap routes with Suspense
const SuspenseWrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
);

// Create the router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Auth routes */}
      {authRoutes}

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Template routes */}
        {templateRoutes}

        {/* Feature routes */}
        {jobRoutes}
        {activityRoutes}
        {calendarRoutes}
        {communicationRoutes}
        {dashboardRoutes}
        {expensesRoutes}
        {financialRoutes}
        {paymentRoutes}
        {teamRoutes}
        {tradingRoutes}
        {SettingsRoutes}

        {/* Main routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/material-ordering" element={<MaterialOrdering />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/development" element={<DevelopmentEntry />} />
        <Route path="/ai-features" element={<AIFeatures />} />
        <Route path="/team-red" element={<TeamRed />} />
        <Route path="/team-blue" element={<TeamBlue />} />
        <Route path="/team-green" element={<TeamGreen />} />
        <Route path="/team-new" element={<TeamNew />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/workflow" element={<Workflow />} />
        <Route path="/property-boundaries" element={<PropertyBoundaries />} />
        <Route path="/site-audits" element={<SiteAudits />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/trading" element={<Trading />} />
        <Route path="/trade-dash" element={<TradeDash />} />
        <Route path="/tags" element={<TagsPage />} />

        {/* Invoice routes */}
        <Route path="/invoices" element={<SuspenseWrapper><InvoicesPage /></SuspenseWrapper>} />
        <Route path="/invoices/new" element={<SuspenseWrapper><NewInvoice /></SuspenseWrapper>} />
        <Route path="/invoices/:id" element={<SuspenseWrapper><InvoiceDetail /></SuspenseWrapper>} />

        {/* Settings routes */}
        <Route path="/settings/*" element={<SuspenseWrapper><SettingsPage /></SuspenseWrapper>} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

export default router;

