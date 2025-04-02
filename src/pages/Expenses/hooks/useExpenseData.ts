
import { useState, useEffect } from 'react';
import { Expense, ExpenseSummary } from '../types';

// Mock data for demonstration
const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    amount: 125.99,
    category: 'Office Supplies',
    description: 'Printer ink and paper',
    date: '2023-08-15T10:30:00Z',
    vendor: 'Office Depot',
    receipt: '/sample-receipt.jpg',
    status: 'approved',
    submittedBy: 'John Doe',
    approvedBy: 'Jane Smith',
  },
  {
    id: '2',
    amount: 45.75,
    category: 'Travel',
    description: 'Taxi fare',
    date: '2023-08-10T14:15:00Z',
    vendor: 'Yellow Cab',
    status: 'approved',
    submittedBy: 'John Doe',
  },
  {
    id: '3',
    amount: 89.50,
    category: 'Meals',
    description: 'Team lunch',
    date: '2023-08-05T12:00:00Z',
    vendor: 'Chipotle',
    receipt: '/sample-receipt2.jpg',
    status: 'pending',
    submittedBy: 'Alice Brown',
  },
  {
    id: '4',
    amount: 1299.99,
    category: 'Equipment',
    description: 'New laptop',
    date: '2023-07-28T09:45:00Z',
    vendor: 'Best Buy',
    receipt: '/sample-receipt3.jpg',
    status: 'approved',
    submittedBy: 'Bob Johnson',
    approvedBy: 'Jane Smith',
  },
  {
    id: '5',
    amount: 250.00,
    category: 'Software',
    description: 'Annual subscription',
    date: '2023-07-15T16:20:00Z',
    vendor: 'Adobe',
    status: 'rejected',
    submittedBy: 'Alice Brown',
    notes: 'Please use company account for subscriptions',
  },
  {
    id: '6',
    amount: 75.25,
    category: 'Office Supplies',
    description: 'Notebooks and pens',
    date: '2023-07-10T11:30:00Z',
    vendor: 'Staples',
    receipt: '/sample-receipt4.jpg',
    status: 'pending',
    submittedBy: 'John Doe',
  },
  {
    id: '7',
    amount: 180.00,
    category: 'Training',
    description: 'Online course',
    date: '2023-07-05T13:45:00Z',
    vendor: 'Udemy',
    status: 'approved',
    submittedBy: 'Bob Johnson',
    approvedBy: 'Jane Smith',
  },
];

export const useExpenseData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseSummary, setExpenseSummary] = useState<ExpenseSummary>({
    totalExpenses: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    byCategory: {},
    recentExpenses: [],
  });
  const [expensesByCategory, setExpensesByCategory] = useState<{ name: string; value: number }[]>([]);
  const [expensesByMonth, setExpensesByMonth] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // In a real app, we would fetch data from an API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setExpenses(MOCK_EXPENSES);
        
        // Calculate summary data
        const totalExpenses = MOCK_EXPENSES.reduce((sum, expense) => sum + expense.amount, 0);
        const pendingCount = MOCK_EXPENSES.filter(exp => exp.status === 'pending').length;
        const approvedCount = MOCK_EXPENSES.filter(exp => exp.status === 'approved').length;
        const rejectedCount = MOCK_EXPENSES.filter(exp => exp.status === 'rejected').length;
        
        // Group expenses by category
        const byCategory: Record<string, number> = {};
        MOCK_EXPENSES.forEach(expense => {
          byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
        });
        
        // Get recent expenses
        const recentExpenses = [...MOCK_EXPENSES]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
          
        setExpenseSummary({
          totalExpenses,
          pendingCount,
          approvedCount,
          rejectedCount,
          byCategory,
          recentExpenses,
        });
        
        // Format data for charts
        const categoryChartData = Object.entries(byCategory).map(([name, value]) => ({
          name,
          value,
        }));
        setExpensesByCategory(categoryChartData);
        
        // Group by month
        const monthlyData: Record<string, number> = {};
        MOCK_EXPENSES.forEach(expense => {
          const date = new Date(expense.date);
          const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
          monthlyData[monthYear] = (monthlyData[monthYear] || 0) + expense.amount;
        });
        
        // Sort by date
        const monthlyChartData = Object.entries(monthlyData)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => {
            const monthA = new Date(a.name).getTime();
            const monthB = new Date(b.name).getTime();
            return monthA - monthB;
          });
          
        setExpensesByMonth(monthlyChartData);
      } catch (error) {
        console.error('Error fetching expense data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return {
    expenses,
    expenseSummary,
    isLoading,
    expensesByCategory,
    expensesByMonth,
  };
};
