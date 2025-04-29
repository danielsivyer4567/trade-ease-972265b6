import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Development mode check - bypasses authentication in dev mode
  const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
  const bypassAuthInDev = import.meta.env.VITE_BYPASS_AUTH_IN_DEV !== 'false';
  
  if (loading) {
    // You can replace this with a loading spinner component
    return <div className="flex h-screen w-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Allow access in development mode even without authentication
  if (!user && !isDevelopment) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If in development mode and no user, log a message but allow access
  if (!user && isDevelopment && bypassAuthInDev) {
    // Only log in development mode and if bypass is enabled
    if (import.meta.env.DEV) {
      console.debug('DEV MODE: Bypassing authentication for development');
    }
  }

  return <Outlet />;
}
