import React, { Suspense, ReactNode, lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouteObject, Navigate } from 'react-router-dom';
import { LoadingFallback } from './loading-fallback';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { authRoutes } from './auth-routes';
import { SettingsRoutes } from './settings-routes';
import { templateRoutes } from './template-routes';

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
import NotFoundPage from '../pages/NotFound';
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
const JobInvoices = lazy(() => import('../pages/Invoices/JobInvoices'));

// Helper component for Suspense boundary
const SuspenseWrapper = ({ children }: { children: ReactNode }) => (
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
    element: <Navigate to="/auth/login" replace />
  },
  
  // Auth Routes (now converted RouteObjects)
  ...authRouteObjects,
  {
    // Protected Routes Layout
    element: <ProtectedRoute />,
    children: [
      // Main routes - only including actual existing pages
      { path: "/", element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: "jobs/*", element: <SuspenseWrapper><JobsPage /></SuspenseWrapper> },
      { path: "job-details/:id", element: <SuspenseWrapper><JobDetails /></SuspenseWrapper> },
      { path: "messaging/*", element: <SuspenseWrapper><Messaging /></SuspenseWrapper> },
      { path: "customers/*", element: <SuspenseWrapper><Customers /></SuspenseWrapper> },
      { path: "material-ordering", element: <SuspenseWrapper><MaterialOrdering /></SuspenseWrapper> },
      { path: "workflow/*", element: <SuspenseWrapper><Workflow /></SuspenseWrapper> },
      { path: "property-boundaries/*", element: <SuspenseWrapper><PropertyBoundaries /></SuspenseWrapper> },
      { path: "site-audits/*", element: <SuspenseWrapper><SiteAudits /></SuspenseWrapper> },
      { path: "inventory/*", element: <SuspenseWrapper><Inventory /></SuspenseWrapper> },
      { path: "calendar/*", element: <SuspenseWrapper><Calendar /></SuspenseWrapper> },
      { path: "statistics", element: <SuspenseWrapper><Statistics /></SuspenseWrapper> },
      { path: "tasks", element: <SuspenseWrapper><Tasks /></SuspenseWrapper> },
      { path: "performance", element: <SuspenseWrapper><Performance /></SuspenseWrapper> },
      { path: "ai-features/*", element: <SuspenseWrapper><AIFeatures /></SuspenseWrapper> },
      { path: "trading/*", element: <SuspenseWrapper><Trading /></SuspenseWrapper> },
      { path: "trade-dash/*", element: <SuspenseWrapper><TradeDash /></SuspenseWrapper> },
      { path: "tags", element: <SuspenseWrapper><TagsPage /></SuspenseWrapper> },
      
      // Invoice routes - specific routes first, then parameterized routes
      { path: "invoices", element: <SuspenseWrapper><InvoicesPage /></SuspenseWrapper> },
      { path: "invoices/new", element: <SuspenseWrapper><NewInvoice /></SuspenseWrapper> },
      { path: "invoices/job/:jobId", element: <SuspenseWrapper><JobInvoices /></SuspenseWrapper> },
      { path: "invoices/:id", element: <SuspenseWrapper><InvoiceDetail /></SuspenseWrapper> },
      
      // Team routes
      { path: "teams/*", element: <SuspenseWrapper><Teams /></SuspenseWrapper> },
      { path: "team-red", element: <SuspenseWrapper><TeamRed /></SuspenseWrapper> },
      { path: "team-blue", element: <SuspenseWrapper><TeamBlue /></SuspenseWrapper> },
      { path: "team-green", element: <SuspenseWrapper><TeamGreen /></SuspenseWrapper> },
      { path: "team-new", element: <SuspenseWrapper><TeamNew /></SuspenseWrapper> },
      
      // Settings Routes
      {
        path: "settings", // Base path for settings
        children: settingsRouteObjects // Nest the objects returned by SettingsRoutes()
      },
      
      // Template Routes
      templateRoutes
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
  }
});

