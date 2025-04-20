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

// Customers API
export const fetchCustomersFromAPI = async (): Promise<CustomerData[]> => {
  try {
    const response = await apiClient.get('/customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching customers from API:', error);
    throw error;
  }
};

export const openCustomer = async (customerId: string): Promise<void> => {
  try {
    await apiClient.get(`/customers/${customerId}/open`);
  } catch (error) {
    console.error('Error opening customer:', error);
    throw error;
  }
};

export default {
  fetchCustomersFromAPI,
  openCustomer,
}; 