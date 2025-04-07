
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // In a real application, you would check if the user is authenticated here
  // For example: if (!isAuthenticated) return <Navigate to="/login" />;
  const isAuthenticated = true; // Mock authentication state
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children ? <>{children}</> : <Outlet />;
};
