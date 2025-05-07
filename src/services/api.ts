import axios from 'axios';
import { CustomerData } from '@/pages/Customers/components/CustomerCard';

const API_URL = 'http://localhost:8081';

// Create axios instance with base config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock customers data
const MOCK_CUSTOMERS: CustomerData[] = [
  {
    id: 'CUST-1001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St',
    city: 'Anytown',
    state: 'ST',
    zipCode: '12345',
    status: 'active'
  },
  {
    id: 'CUST-1002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave',
    city: 'Somewhere',
    state: 'ST',
    zipCode: '67890',
    status: 'active'
  },
  {
    id: 'CUST-1003',
    name: 'Michael Barnes',
    email: 'mbarnes@example.com',
    phone: '(555) 234-5678',
    address: '789 Pine Dr',
    city: 'Elsewhere',
    state: 'ST',
    zipCode: '54321',
    status: 'inactive'
  }
];

// Customers API
export const fetchCustomersFromAPI = async (): Promise<CustomerData[]> => {
  try {
    // Uncomment below when API is ready and comment out the mock data return
    // const response = await apiClient.get('/customers');
    // return response.data;
    
    // Return mock data for now
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return MOCK_CUSTOMERS.map(customer => ({
      ...customer,
      progress: Math.floor(Math.random() * 100),
      lastContact: '2023-12-' + Math.floor(Math.random() * 30 + 1).toString().padStart(2, '0'),
      jobId: 'JOB-' + Math.floor(1000 + Math.random() * 9000),
      jobTitle: ['Kitchen Renovation', 'Bathroom Remodel', 'Roof Repair', 'Deck Installation'][Math.floor(Math.random() * 4)]
    }));
  } catch (error) {
    console.error('Error fetching customers from API:', error);
    throw error;
  }
};

export const openCustomer = async (customerId: string): Promise<void> => {
  try {
    // First call the API endpoint
    await apiClient.get(`/customers/${customerId}/open`);
    
    // Then open the customer in a new tab
    window.open(`${API_URL}/customers/${customerId}`, '_blank');
  } catch (error) {
    console.error('Error opening customer:', error);
    throw error;
  }
};

export default {
  fetchCustomersFromAPI,
  openCustomer,
}; 