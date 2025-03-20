
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

// Define the route type
export interface RouteConfig {
  path: string;
  element: ReactNode;
}

// Define the application routes
export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Index />
  },
  {
    path: '/trade-dash',
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
    path: '/calculators',
    element: <Calculators />
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
    path: '/settings',
    element: <SettingsPage />
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
