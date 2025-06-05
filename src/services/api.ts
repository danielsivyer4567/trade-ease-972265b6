import axios from 'axios';
import { CustomerData } from '@/pages/Customers/components/CustomerCard';

// Use dynamic base URL detection with fallbacks
const getBaseUrl = () => {
  // Try to get the current origin (window.location.origin) or use a fallback
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8080';
  
  // For local development, keep localhost:8081
  if (origin.includes('localhost')) {
    return 'http://localhost:8081';
  }
  
  // Otherwise use the current origin
  return origin;
};

const API_URL = getBaseUrl();

// Mock data for customers when API is unavailable
const MOCK_CUSTOMERS: CustomerData[] = [
  {
    id: "c001",
    name: "John Smith",
    email: "john@example.com",
    phone: "0412 345 678",
    address: "123 Main St",
    city: "Brisbane",
    state: "QLD",
    zipCode: "4000",
    status: "active"
  },
  {
    id: "c002",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "0423 456 789",
    address: "456 High St",
    city: "Gold Coast",
    state: "QLD",
    zipCode: "4217",
    status: "active"
  }
];

// Create axios instance with base config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout to prevent long waits
});

// Customers API
export const fetchCustomersFromAPI = async (): Promise<CustomerData[]> => {
  try {
    // Use the actual API endpoint
    const response = await apiClient.get('/customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching customers from API:', error);
    // Return mock data on failure
    return MOCK_CUSTOMERS;
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
    // Fallback to just opening the URL
    window.open(`/customers/${customerId}`, '_self');
  }
};

export default {
  fetchCustomersFromAPI,
  openCustomer,
}; 