import { Routes as RouterRoutes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Auth from '@/pages/Auth'
import NotFound from '@/pages/NotFound'
import Index from '@/pages/Index'
import Jobs from '@/pages/Jobs'
import JobManagement from '@/pages/JobManagement'
import Customers from '@/pages/Customers'
import NewCustomer from '@/pages/Customers/NewCustomer'
import CustomerDetail from '@/pages/Customers/CustomerDetail'
import Notifications from '@/pages/Notifications'
import Teams from '@/pages/Teams'
import TradeDash from '@/pages/TradeDash'
import Calendar from '@/pages/Calendar'
import CalendarSync from '@/pages/Calendar/CalendarSync'
import TasksPage from '@/pages/Tasks'
import TeamRed from '@/pages/TeamRed'
import TeamBlue from '@/pages/TeamBlue'
import TeamGreen from '@/pages/TeamGreen'
import Database from '@/pages/Database'
import Integrations from '@/pages/Integrations'
import Calculators from '@/pages/Calculators'
import AIFeatures from '@/pages/AIFeatures'
import Email from '@/pages/Email'
import Messaging from '@/pages/Messaging'
import SettingsPage from '@/pages/Settings'
import Quotes from '@/pages/Quotes'
import Statistics from '@/pages/Statistics'
import NotificationsSettings from '@/pages/Settings/Notifications'
import TradeRatesCalculator from '@/pages/Settings/TradeRatesCalculator'
import BillsPurchaseOrders from '@/pages/Settings/BillsPurchaseOrders'
import AIAssistantSettings from '@/pages/Settings/AIAssistantSettings'
import ContractorsPage from '@/pages/Settings/Contractors'
import OfficeStaff from '@/pages/Settings/OfficeStaff'
import IntegrationsPage from '@/pages/Settings/Integrations'
import LoadsSpansCalculator from '@/pages/Calculators/LoadsSpansCalculator'
import MarkupCalculator from '@/pages/Calculators/MarkupCalculator'
import JobCostCalculator from '@/pages/Calculators/JobCostCalculator'
import FencingCalculator from '@/pages/Calculators/FencingCalculator'
import NCCCodesCalculator from '@/pages/Calculators/NCCCodesCalculator'
import WorkflowPage from '@/pages/Workflow'

export function Routes() {
  return (
    <RouterRoutes>
      {/* Public routes */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/callback" element={<Auth />} />
      
      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/tradedash" element={<ProtectedRoute><TradeDash /></ProtectedRoute>} />
      <Route path="/workflow" element={<ProtectedRoute><WorkflowPage /></ProtectedRoute>} />
      <Route path="/statistics" element={<ProtectedRoute><Statistics /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
      <Route path="/jobs/*" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
      <Route path="/job-management" element={<ProtectedRoute><JobManagement /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      <Route path="/calendar/sync" element={<ProtectedRoute><CalendarSync /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
      <Route path="/customers/new" element={<ProtectedRoute><NewCustomer /></ProtectedRoute>} />
      <Route path="/customers/:id" element={<ProtectedRoute><CustomerDetail /></ProtectedRoute>} />
      <Route path="/quotes" element={<ProtectedRoute><Quotes /></ProtectedRoute>} />
      <Route path="/messaging" element={<ProtectedRoute><Messaging /></ProtectedRoute>} />
      <Route path="/email" element={<ProtectedRoute><Email /></ProtectedRoute>} />
      <Route path="/ai-features" element={<ProtectedRoute><AIFeatures /></ProtectedRoute>} />
      
      {/* Calculator routes */}
      <Route path="/calculators" element={<ProtectedRoute><Calculators /></ProtectedRoute>} />
      <Route path="/calculators/loads-spans" element={<ProtectedRoute><LoadsSpansCalculator /></ProtectedRoute>} />
      <Route path="/calculators/markup" element={<ProtectedRoute><MarkupCalculator /></ProtectedRoute>} />
      <Route path="/calculators/job-cost" element={<ProtectedRoute><JobCostCalculator /></ProtectedRoute>} />
      <Route path="/calculators/fencing" element={<ProtectedRoute><FencingCalculator /></ProtectedRoute>} />
      <Route path="/calculators/ncc-codes" element={<ProtectedRoute><NCCCodesCalculator /></ProtectedRoute>} />
      
      {/* Other protected routes */}
      <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
      <Route path="/database" element={<ProtectedRoute><Database /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      
      {/* Settings subpages */}
      <Route path="/settings/notifications" element={<ProtectedRoute><NotificationsSettings /></ProtectedRoute>} />
      <Route path="/settings/trade-rates" element={<ProtectedRoute><TradeRatesCalculator /></ProtectedRoute>} />
      <Route path="/settings/bills-purchase-orders" element={<ProtectedRoute><BillsPurchaseOrders /></ProtectedRoute>} />
      <Route path="/settings/ai-assistant-settings" element={<ProtectedRoute><AIAssistantSettings /></ProtectedRoute>} />
      <Route path="/settings/contractors" element={<ProtectedRoute><ContractorsPage /></ProtectedRoute>} />
      <Route path="/settings/office-staff" element={<ProtectedRoute><OfficeStaff /></ProtectedRoute>} />
      <Route path="/settings/integrations" element={<ProtectedRoute><IntegrationsPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/team-red" element={<ProtectedRoute><TeamRed /></ProtectedRoute>} />
      <Route path="/team-blue" element={<ProtectedRoute><TeamBlue /></ProtectedRoute>} />
      <Route path="/team-green" element={<ProtectedRoute><TeamGreen /></ProtectedRoute>} />
      <Route path="/teams/*" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
      
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </RouterRoutes>
  )
} 