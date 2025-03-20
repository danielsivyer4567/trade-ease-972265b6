
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
    element: <div className="p-6"><h1 className="text-2xl font-bold">Statistics</h1></div>
  },
  {
    path: '/tasks',
    element: <TasksPage />
  },
  {
    path: '/jobs',
    element: <div className="p-6"><h1 className="text-2xl font-bold">Jobs</h1></div>
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
    element: <div className="p-6"><h1 className="text-2xl font-bold">Quotes</h1></div>
  },
  {
    path: '/messaging',
    element: <div className="p-6"><h1 className="text-2xl font-bold">Messaging</h1></div>
  },
  {
    path: '/email',
    element: <div className="p-6"><h1 className="text-2xl font-bold">Email</h1></div>
  },
  {
    path: '/ai-features',
    element: <div className="p-6"><h1 className="text-2xl font-bold">AI Features</h1></div>
  },
  {
    path: '/calculators',
    element: <div className="p-6"><h1 className="text-2xl font-bold">Calculators</h1></div>
  },
  {
    path: '/integrations',
    element: <div className="p-6"><h1 className="text-2xl font-bold">Integrations</h1></div>
  },
  {
    path: '/database',
    element: <div className="p-6"><h1 className="text-2xl font-bold">Database</h1></div>
  },
  {
    path: '/settings',
    element: <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1></div>
  },
  {
    path: '/notifications',
    element: <Notifications />
  }
];
