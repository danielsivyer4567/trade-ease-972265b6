
import { useState, useEffect } from 'react';
import { ExpenseReport } from '../types';

// Mock data for demonstration
const INITIAL_REPORTS: ExpenseReport[] = [
  {
    id: '1',
    name: 'Monthly Report - August 2023',
    dateRange: {
      start: '2023-08-01T00:00:00Z',
      end: '2023-08-31T23:59:59Z',
    },
    totalAmount: 1456.24,
    expenseCount: 12,
    createdAt: '2023-09-01T10:30:00Z',
    status: 'approved',
    expenses: ['1', '2', '3'],
  },
  {
    id: '2',
    name: 'Monthly Report - July 2023',
    dateRange: {
      start: '2023-07-01T00:00:00Z',
      end: '2023-07-31T23:59:59Z',
    },
    totalAmount: 2104.75,
    expenseCount: 15,
    createdAt: '2023-08-02T14:45:00Z',
    status: 'approved',
    expenses: ['4', '5', '6', '7'],
  },
  {
    id: '3',
    name: 'Q2 Report - 2023',
    dateRange: {
      start: '2023-04-01T00:00:00Z',
      end: '2023-06-30T23:59:59Z',
    },
    totalAmount: 6785.50,
    expenseCount: 42,
    createdAt: '2023-07-05T09:15:00Z',
    status: 'approved',
    expenses: [],
  },
  {
    id: '4',
    name: 'Weekly Report - Sep 1-7, 2023',
    dateRange: {
      start: '2023-09-01T00:00:00Z',
      end: '2023-09-07T23:59:59Z',
    },
    totalAmount: 357.25,
    expenseCount: 4,
    createdAt: '2023-09-08T16:20:00Z',
    status: 'submitted',
    expenses: [],
  },
  {
    id: '5',
    name: 'Monthly Report - September 2023',
    dateRange: {
      start: '2023-09-01T00:00:00Z',
      end: '2023-09-30T23:59:59Z',
    },
    totalAmount: 542.90,
    expenseCount: 8,
    createdAt: '2023-10-03T11:10:00Z',
    status: 'draft',
    expenses: [],
  },
];

interface GenerateReportOptions {
  name: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  date: Date;
}

export const useExpenseReports = () => {
  const [reports, setReports] = useState<ExpenseReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    const fetchReports = async () => {
      try {
        // In a real app, we would fetch data from an API
        await new Promise(resolve => setTimeout(resolve, 800));
        setReports(INITIAL_REPORTS);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReports();
  }, []);
  
  const generateReport = async (options: GenerateReportOptions) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate date range based on period
      let startDate = new Date(options.date);
      let endDate = new Date(options.date);
      
      switch (options.period) {
        case 'week':
          startDate.setDate(startDate.getDate() - startDate.getDay());
          endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6);
          break;
        case 'month':
          startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
          endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
          break;
        case 'quarter':
          const quarter = Math.floor(startDate.getMonth() / 3);
          startDate = new Date(startDate.getFullYear(), quarter * 3, 1);
          endDate = new Date(startDate.getFullYear(), (quarter + 1) * 3, 0);
          break;
        case 'year':
          startDate = new Date(startDate.getFullYear(), 0, 1);
          endDate = new Date(startDate.getFullYear(), 11, 31);
          break;
      }
      
      const newReport: ExpenseReport = {
        id: Date.now().toString(),
        name: options.name,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        totalAmount: Math.random() * 1000 + 200, // Random amount for demo
        expenseCount: Math.floor(Math.random() * 10) + 1, // Random count for demo
        createdAt: new Date().toISOString(),
        status: 'draft',
        expenses: [],
      };
      
      setReports(prev => [newReport, ...prev]);
      return newReport;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  };
  
  return {
    reports,
    isLoading,
    generateReport,
  };
};
