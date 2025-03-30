
import { ReactNode } from 'react';
import Customers from './pages/Customers';
import NewCustomer from './pages/Customers/NewCustomer';
import CustomerDetail from './pages/Customers/CustomerDetail';
import Index from './pages/Index';
import TradeDash from './pages/TradeDash';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import Calendar from './pages/Calendar';
import CalendarSync from './pages/Calendar/CalendarSync';
import TasksPage from './pages/Tasks';
import Jobs from './pages/Jobs';
import TeamRed from './pages/TeamRed';
import TeamBlue from './pages/TeamBlue';
import TeamGreen from './pages/TeamGreen';
import Database from './pages/Database';
import Integrations from './pages/Integrations';
import Calculators from './pages/Calculators';
import AIFeatures from './pages/AIFeatures';
import Email from './pages/Email';
import Messaging from './pages/Messaging';
import SettingsPage from './pages/Settings';
import Quotes from './pages/Quotes';
import Statistics from './pages/Statistics';
import NotificationsSettings from './pages/Settings/Notifications';
import TradeRatesCalculator from './pages/Settings/TradeRatesCalculator';
import BillsPurchaseOrders from './pages/Settings/BillsPurchaseOrders';
import AIAssistantSettings from './pages/Settings/AIAssistantSettings';
import ContractorsPage from './pages/Settings/Contractors';
import OfficeStaff from './pages/Settings/OfficeStaff';
import IntegrationsPage from './pages/Settings/Integrations';
import JobSettings from './pages/Settings/JobSettings';
import LoadsSpansCalculator from './pages/Calculators/LoadsSpansCalculator';
import MarkupCalculator from './pages/Calculators/MarkupCalculator';
import JobCostCalculator from './pages/Calculators/JobCostCalculator';
import FencingCalculator from './pages/Calculators/FencingCalculator';
import NCCCodesCalculator from './pages/Calculators/NCCCodesCalculator';
import Auth from './pages/Auth';
import PropertyBoundaries from './pages/PropertyBoundaries';
import Referrals from './pages/Referrals';
import SiteAudits from './pages/SiteAudits';
import Forms from './pages/Forms';
import Automations from './pages/Automations';

export interface RouteConfig {
  path: string;
  element: ReactNode;
}

export const routes: RouteConfig[] = [
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/auth/callback',
    element: <Auth />
  },
  
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/tradedash',
    element: <TradeDash />
  },
  {
    path: '/workflow',
    element: <div className="p-6"><h1 className="text-2xl font-bold">Workflow Builder</h1></div>
  },
  {
    path: '/statistics',
    element: <Statistics />
  },
  {
    path: '/tasks',
    element: <TasksPage />
  },
  {
    path: '/forms',
    element: <Forms />
  },
  {
    path: '/jobs/*',
    element: <Jobs />
  },
  {
    path: '/calendar',
    element: <Calendar />
  },
  {
    path: '/calendar/sync',
    element: <CalendarSync />
  },
  {
    path: '/customers',
    element: <Customers />
  },
  {
    path: '/customers/new',
    element: <NewCustomer />
  },
  {
    path: '/customers/:id',
    element: <CustomerDetail />
  },
  {
    path: '/quotes',
    element: <Quotes />
  },
  {
    path: '/messaging',
    element: <Messaging />
  },
  {
    path: '/email',
    element: <Email />
  },
  {
    path: '/ai-features',
    element: <AIFeatures />
  },
  {
    path: '/site-audits',
    element: <SiteAudits />
  },
  {
    path: '/calculators',
    element: <Calculators />
  },
  {
    path: '/calculators/loads-spans',
    element: <LoadsSpansCalculator />
  },
  {
    path: '/calculators/markup',
    element: <MarkupCalculator />
  },
  {
    path: '/calculators/job-cost',
    element: <JobCostCalculator />
  },
  {
    path: '/calculators/fencing',
    element: <FencingCalculator />
  },
  {
    path: '/calculators/ncc-codes',
    element: <NCCCodesCalculator />
  },
  {
    path: '/integrations',
    element: <Integrations />
  },
  {
    path: '/database',
    element: <Database />
  },
  {
    path: '/automations',
    element: <Automations />
  },
  {
    path: '/settings',
    element: <SettingsPage />
  },
  {
    path: '/property-boundaries',
    element: <PropertyBoundaries />
  },
  {
    path: '/referrals',
    element: <Referrals />
  },
  {
    path: '/settings/notifications',
    element: <NotificationsSettings />
  },
  {
    path: '/settings/trade-rates',
    element: <TradeRatesCalculator />
  },
  {
    path: '/settings/bills-purchase-orders',
    element: <BillsPurchaseOrders />
  },
  {
    path: '/settings/ai-assistant-settings',
    element: <AIAssistantSettings />
  },
  {
    path: '/settings/contractors',
    element: <ContractorsPage />
  },
  {
    path: '/settings/office-staff',
    element: <OfficeStaff />
  },
  {
    path: '/settings/integrations',
    element: <IntegrationsPage />
  },
  {
    path: '/settings/jobs',
    element: <JobSettings />
  },
  {
    path: '/notifications',
    element: <Notifications />
  },
  {
    path: '/team-red',
    element: <TeamRed />
  },
  {
    path: '/team-blue',
    element: <TeamBlue />
  },
  {
    path: '/team-green',
    element: <TeamGreen />
  }
];
