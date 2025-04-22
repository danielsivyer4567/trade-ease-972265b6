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
