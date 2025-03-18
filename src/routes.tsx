
import { ReactNode } from 'react';
import Customers from './pages/Customers';
import NewCustomer from './pages/Customers/NewCustomer';
import CustomerDetail from './pages/Customers/CustomerDetail';

// Define the route type
export interface RouteConfig {
  path: string;
  element: ReactNode;
}

// Define the application routes
export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Customers />
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
  }
];
