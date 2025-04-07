
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // In a real application, you would check if the user is authenticated here
  // For example: if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <>{children}</>;
};
