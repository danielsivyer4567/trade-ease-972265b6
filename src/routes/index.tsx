
import { Routes as RouterRoutes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Auth from '@/pages/Auth'
import NotFound from '@/pages/NotFound'
import Index from '@/pages/Index'
import Jobs from '@/pages/Jobs'
import Customers from '@/pages/Customers'
import Notifications from '@/pages/Notifications'
import Teams from '@/pages/Teams'
import NewPayment from '@/pages/Payments/NewPayment'
import Quotes from '@/pages/Quotes'
import NewQuote from '@/pages/Quotes/NewQuote'
import Calendar from '@/pages/Calendar'
import TeamRed from '@/pages/TeamRed'
import TeamBlue from '@/pages/TeamBlue'
import TeamGreen from '@/pages/TeamGreen'
import TradeDash from '@/pages/TradeDash'
import PropertyBoundaries from '@/pages/PropertyBoundaries'
import Messaging from '@/pages/Messaging'
import Referrals from '@/pages/Referrals'
import Tasks from '@/pages/Tasks'
import SettingsPage from '@/pages/Settings'

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
        path="/tradedash"
        element={
          <ProtectedRoute>
            <TradeDash />
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
      <Route
        path="/payments/new"
        element={
          <ProtectedRoute>
            <NewPayment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quotes"
        element={
          <ProtectedRoute>
            <Quotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quotes/new"
        element={
          <ProtectedRoute>
            <NewQuote />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messaging"
        element={
          <ProtectedRoute>
            <Messaging />
          </ProtectedRoute>
        }
      />
      <Route
        path="/referrals"
        element={
          <ProtectedRoute>
            <Referrals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team-red"
        element={
          <ProtectedRoute>
            <TeamRed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team-blue"
        element={
          <ProtectedRoute>
            <TeamBlue />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team-green"
        element={
          <ProtectedRoute>
            <TeamGreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/property-boundaries"
        element={
          <ProtectedRoute>
            <PropertyBoundaries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  )
}
