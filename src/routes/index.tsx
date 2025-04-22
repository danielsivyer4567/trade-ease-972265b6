import React, { Suspense, ReactNode } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouteObject, Navigate } from 'react-router-dom';
import { LoadingFallback } from './loading-fallback';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { authRoutes } from './auth-routes';
import { SettingsRoutes } from './settings-routes';
import { templateRoutes } from './template-routes';
import DevelopmentEntry from '../pages/DevelopmentEntry';
import DashboardPage from '../pages/Dashboard';
import NotFoundPage from '../pages/NotFound';

// Import the page components directly to avoid lazy loading issues
import JobsPage from '../pages/Jobs';
import JobDetails from '../pages/JobDetails';
import MaterialOrdering from '../pages/MaterialOrdering';
import Statistics from '../pages/Statistics';
import Tasks from '../pages/Tasks';
import Performance from '../pages/Performance';
import { StubPage } from '../components/ui/StubPage';

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
      { path: "/", element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      
      // Main navigation routes with direct imports
      { path: "jobs", element: <SuspenseWrapper><JobsPage /></SuspenseWrapper> },
      { path: "jobs/:id", element: <SuspenseWrapper><JobDetails /></SuspenseWrapper> },
      { path: "material-ordering", element: <SuspenseWrapper><MaterialOrdering /></SuspenseWrapper> },
      { path: "statistics", element: <SuspenseWrapper><Statistics /></SuspenseWrapper> },
      { path: "tasks", element: <SuspenseWrapper><Tasks /></SuspenseWrapper> },
      { path: "performance", element: <SuspenseWrapper><Performance /></SuspenseWrapper> },
      
      // Stub pages for routes still in development
      { 
        path: "messaging", 
        element: <SuspenseWrapper><StubPage title="Messaging" description="Communication center for your team and clients." /></SuspenseWrapper> 
      },
      { 
        path: "customers", 
        element: <SuspenseWrapper><StubPage title="Customers" description="Manage your customer database and relationships." /></SuspenseWrapper> 
      },
      { 
        path: "calendar", 
        element: <SuspenseWrapper><StubPage title="Calendar" description="Schedule and manage appointments and project timelines." /></SuspenseWrapper> 
      },
      { 
        path: "inventory", 
        element: <SuspenseWrapper><StubPage title="Inventory" description="Track and manage your inventory and supplies." /></SuspenseWrapper> 
      },
      { 
        path: "payments", 
        element: <SuspenseWrapper><StubPage title="Payments" description="Manage invoices, payments, and financial transactions." /></SuspenseWrapper> 
      },
      { 
        path: "networks", 
        element: <SuspenseWrapper><StubPage title="Networks" description="Connect with partners, suppliers, and industry networks." /></SuspenseWrapper> 
      },
      { 
        path: "email", 
        element: <SuspenseWrapper><StubPage title="Email" description="Email communication and campaign management." /></SuspenseWrapper> 
      },
      
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
