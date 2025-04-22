import React, { Suspense, ReactNode, lazy } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouteObject, Navigate } from 'react-router-dom';
import { LoadingFallback } from './loading-fallback';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { authRoutes } from './auth-routes';
import { SettingsRoutes } from './settings-routes';
import { templateRoutes } from './template-routes';
import DevelopmentEntry from '../pages/DevelopmentEntry';
import DashboardPage from '../pages/Dashboard';
import NotFoundPage from '../pages/NotFound';

// Dynamically import page components
const JobsPage = lazy(() => import('../pages/Jobs'));
const MessagingPage = lazy(() => import('../pages/Messaging'));
const CustomersPage = lazy(() => import('../pages/Customers'));
const CalendarPage = lazy(() => import('../pages/Calendar'));
const InventoryPage = lazy(() => import('../pages/Inventory'));
const PaymentsPage = lazy(() => import('../pages/Payments'));
const NetworksPage = lazy(() => import('../pages/Networks'));
const EmailPage = lazy(() => import('../pages/Email'));

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
      
      // Main navigation routes with actual implementations
      { 
        path: "jobs/*", 
        element: <SuspenseWrapper><JobsPage /></SuspenseWrapper> 
      },
      { 
        path: "messaging/*", 
        element: <SuspenseWrapper><MessagingPage /></SuspenseWrapper> 
      },
      { 
        path: "customers/*", 
        element: <SuspenseWrapper><CustomersPage /></SuspenseWrapper> 
      },
      { 
        path: "calendar/*", 
        element: <SuspenseWrapper><CalendarPage /></SuspenseWrapper> 
      },
      { 
        path: "inventory/*", 
        element: <SuspenseWrapper><InventoryPage /></SuspenseWrapper> 
      },
      { 
        path: "payments/*", 
        element: <SuspenseWrapper><PaymentsPage /></SuspenseWrapper> 
      },
      { 
        path: "networks/*", 
        element: <SuspenseWrapper><NetworksPage /></SuspenseWrapper> 
      },
      { 
        path: "email/*", 
        element: <SuspenseWrapper><EmailPage /></SuspenseWrapper> 
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
