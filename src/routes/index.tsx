import React, { Suspense, ReactNode, lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouteObject, Navigate } from 'react-router-dom';
import { LoadingFallback } from './loading-fallback';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { authRoutes } from './auth-routes';
import { SettingsRoutes } from './settings-routes';
import { templateRoutes } from './template-routes';
import { StubPage } from '../components/ui/StubPage';

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

// Lazy load components that we know exist
const CustomersPage = lazy(() => import('../pages/Customers'));
const MessagingPage = lazy(() => import('../pages/Messaging'));
const InventoryPage = lazy(() => import('../pages/Inventory'));
const CalendarPage = lazy(() => import('../pages/Calendar'));
const WorkflowPage = lazy(() => import('../pages/Workflow'));
const PropertyBoundariesPage = lazy(() => import('../pages/PropertyBoundaries'));
const SiteAuditsPage = lazy(() => import('../pages/SiteAudits'));
const TradingPage = lazy(() => import('../pages/Trading'));
const TradeDashPage = lazy(() => import('../pages/TradeDash'));
const TeamsPage = lazy(() => import('../pages/Teams'));

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
      // OVERVIEW SECTION
      { path: "/", element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: "jobs/*", element: <SuspenseWrapper><JobsPage /></SuspenseWrapper> },
      { path: "job-details/:id", element: <SuspenseWrapper><JobDetails /></SuspenseWrapper> },
      { path: "messaging/*", element: <SuspenseWrapper><MessagingPage /></SuspenseWrapper> },
      { path: "customers/*", element: <SuspenseWrapper><CustomersPage /></SuspenseWrapper> },
      
      // BUSINESS SECTION
      { 
        path: "quotes/*", 
        element: <SuspenseWrapper><StubPage title="Quotes" description="Create and manage quotes for your customers." /></SuspenseWrapper> 
      },
      { 
        path: "invoices/*", 
        element: <SuspenseWrapper><StubPage title="Invoices" description="Manage and track invoices for your business." /></SuspenseWrapper> 
      },
      { 
        path: "expenses/*", 
        element: <SuspenseWrapper><StubPage title="Expenses" description="Track and categorize your business expenses." /></SuspenseWrapper> 
      },
      { 
        path: "banking/*", 
        element: <SuspenseWrapper><StubPage title="Banking" description="Connect and manage your business banking accounts." /></SuspenseWrapper> 
      },
      
      // TECHNICAL SECTION
      { path: "workflow/*", element: <SuspenseWrapper><WorkflowPage /></SuspenseWrapper> },
      { path: "property-boundaries/*", element: <SuspenseWrapper><PropertyBoundariesPage /></SuspenseWrapper> },
      { path: "site-audits/*", element: <SuspenseWrapper><SiteAuditsPage /></SuspenseWrapper> },
      { path: "ai-features/*", element: <SuspenseWrapper><AIFeatures /></SuspenseWrapper> },
      
      // NETWORKING SECTION
      { 
        path: "networks/*", 
        element: <SuspenseWrapper><StubPage title="Networks" description="Connect with partners, suppliers, and industry networks." /></SuspenseWrapper> 
      },
      { 
        path: "email/*", 
        element: <SuspenseWrapper><StubPage title="Email" description="Email communication and campaign management." /></SuspenseWrapper> 
      },
      
      // SUPPLY CHAIN SECTION
      { path: "inventory/*", element: <SuspenseWrapper><InventoryPage /></SuspenseWrapper> },
      { 
        path: "suppliers/*", 
        element: <SuspenseWrapper><StubPage title="Suppliers" description="Manage your supplier relationships and orders." /></SuspenseWrapper> 
      },
      { path: "material-ordering", element: <SuspenseWrapper><MaterialOrdering /></SuspenseWrapper> },
      
      // OTHER IMPORTANT FEATURES
      { path: "calendar/*", element: <SuspenseWrapper><CalendarPage /></SuspenseWrapper> },
      { 
        path: "payments/*", 
        element: <SuspenseWrapper><StubPage title="Payments" description="Manage invoices, payments, and financial transactions." /></SuspenseWrapper> 
      },
      { path: "statistics", element: <SuspenseWrapper><Statistics /></SuspenseWrapper> },
      { path: "tasks", element: <SuspenseWrapper><Tasks /></SuspenseWrapper> },
      { path: "performance", element: <SuspenseWrapper><Performance /></SuspenseWrapper> },
      
      // TRADING SECTION
      { path: "trading/*", element: <SuspenseWrapper><TradingPage /></SuspenseWrapper> },
      { path: "trade-dash/*", element: <SuspenseWrapper><TradeDashPage /></SuspenseWrapper> },
      
      // TEAMS SECTION
      { path: "teams/*", element: <SuspenseWrapper><TeamsPage /></SuspenseWrapper> },
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

