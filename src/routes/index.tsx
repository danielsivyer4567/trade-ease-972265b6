import { Routes as RouterRoutes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Auth from '@/pages/Auth'
import NotFound from '@/pages/NotFound'
import Index from '@/pages/Index'
import Jobs from '@/pages/Jobs'
import Customers from '@/pages/Customers'
import Notifications from '@/pages/Notifications'
import Teams from '@/pages/Teams'

export function Routes() {
  return (
    <RouterRoutes>
      {/* Public routes */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<Auth />} />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs/*"
        element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers/*"
        element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams/*"
        element={
          <ProtectedRoute>
            <Teams />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  )
} 