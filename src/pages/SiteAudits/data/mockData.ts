
import { Audit, Customer } from '../types/auditTypes';

export const initialAudits: Audit[] = [
  {
    id: '1',
    title: 'Kitchen Renovation Initial Assessment',
    customerId: '1',
    location: '123 Main St, Springfield',
    startDate: '2023-11-15',
    status: 'in_progress',
    assignedTo: 'John Carpenter',
    completedItems: 8,
    totalItems: 12,
    photos: []
  },
  {
    id: '2',
    title: 'Bathroom Remodel Site Check',
    customerId: '2',
    location: '456 Oak Ave, Springfield',
    startDate: '2023-11-10',
    status: 'in_progress',
    assignedTo: 'Sarah Plumber',
    completedItems: 3,
    totalItems: 10,
    photos: []
  },
  {
    id: '3',
    title: 'Deck Installation Follow-up',
    customerId: '3',
    location: '789 Pine St, Springfield',
    startDate: '2023-11-16',
    status: 'scheduled',
    assignedTo: 'Mike Builder',
    completedItems: 0,
    totalItems: 8,
    photos: []
  },
  {
    id: '4',
    title: 'Roof Inspection',
    customerId: '1',
    location: '123 Main St, Springfield',
    startDate: '2023-11-17',
    status: 'scheduled',
    assignedTo: 'John Carpenter',
    completedItems: 0,
    totalItems: 6,
    photos: []
  },
  {
    id: '5',
    title: 'Kitchen Backsplash Installation',
    customerId: '2',
    location: '456 Oak Ave, Springfield',
    startDate: '2023-11-18',
    status: 'scheduled',
    assignedTo: 'Sarah Plumber',
    completedItems: 0,
    totalItems: 4,
    photos: []
  }
];

export const initialCustomers: Customer[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-123-4567',
    address: '123 Main St, Springfield'
  },
  {
    id: '2',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '555-987-6543',
    address: '456 Oak Ave, Springfield'
  },
  {
    id: '3',
    name: 'Emily Williams',
    email: 'emily.williams@example.com',
    phone: '555-321-7654',
    address: '789 Pine St, Springfield'
  }
];
