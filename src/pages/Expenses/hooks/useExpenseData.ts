
import { useState } from "react";
import { Expense, ExpenseSummary, CategoryData, MonthlyData } from "../types";

export function useExpenseData() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      date: "2023-05-01",
      vendor: "Home Depot",
      category: "Materials",
      amount: 540.25,
      status: "approved",
      description: "Lumber and hardware for Smith project",
      submittedBy: "John Doe",
      approvedBy: "Jane Smith",
      tags: ["project-123", "lumber"]
    },
    {
      id: "2",
      date: "2023-05-03",
      vendor: "Lowe's",
      category: "Materials",
      amount: 320.50,
      status: "approved",
      description: "Plumbing supplies for Johnson remodel",
      submittedBy: "John Doe",
      approvedBy: "Jane Smith",
      tags: ["project-456", "plumbing"]
    },
    {
      id: "3",
      date: "2023-05-10",
      vendor: "Shell",
      category: "Travel",
      amount: 65.30,
      status: "approved",
      description: "Fuel for company truck",
      submittedBy: "Mike Wilson",
      approvedBy: "Jane Smith",
      tags: ["fuel", "vehicle-01"]
    },
    {
      id: "4",
      date: "2023-05-15",
      vendor: "Tool Depot",
      category: "Equipment",
      amount: 189.99,
      status: "pending",
      description: "Power drill replacement",
      submittedBy: "Mike Wilson",
      tags: ["tools"]
    },
    {
      id: "5",
      date: "2023-05-20",
      vendor: "Office Supply Co",
      category: "Office",
      amount: 78.45,
      status: "rejected",
      description: "Office supplies - rejected due to missing receipt",
      submittedBy: "Sarah Jones",
      rejectedBy: "Jane Smith",
      notes: "Please resubmit with proper receipt",
      tags: ["office"]
    }
  ]);

  // Calculate summary data
  const calculateSummary = (): ExpenseSummary => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const pendingCount = expenses.filter(e => e.status === 'pending').length;
    const approvedCount = expenses.filter(e => e.status === 'approved').length;
    const rejectedCount = expenses.filter(e => e.status === 'rejected').length;
    
    const recentExpenses = [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    
    // Calculate by category
    const categoryMap: Record<string, number> = {};
    expenses.forEach(expense => {
      if (categoryMap[expense.category]) {
        categoryMap[expense.category] += expense.amount;
      } else {
        categoryMap[expense.category] = expense.amount;
      }
    });
    
    const byCategory: CategoryData[] = Object.keys(categoryMap).map(name => ({
      name,
      value: categoryMap[name],
      color: getCategoryColor(name)
    }));
    
    return {
      totalExpenses,
      pendingCount,
      approvedCount,
      rejectedCount,
      recentExpenses,
      byCategory
    };
  };
  
  // Get a consistent color for categories
  const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      'Materials': '#4f46e5',
      'Labor': '#0891b2',
      'Equipment': '#ea580c',
      'Office': '#16a34a',
      'Travel': '#db2777',
      'Other': '#6b7280'
    };
    
    return colorMap[category] || '#6b7280';
  };
  
  // Get monthly expense data for charts
  const getMonthlyData = (): MonthlyData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTotals: Record<string, number> = {};
    
    // Initialize months with zero values
    months.forEach(month => {
      monthlyTotals[month] = 0;
    });
    
    // Aggregate expense amounts by month
    expenses.forEach(expense => {
      const month = new Date(expense.date).getMonth();
      const monthName = months[month];
      monthlyTotals[monthName] += expense.amount;
    });
    
    // Convert to array format expected by charts
    return months.map(month => ({
      name: month,
      value: monthlyTotals[month]
    }));
  };
  
  // Add an expense
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString()
    };
    setExpenses([...expenses, newExpense]);
  };
  
  // Update an expense
  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, ...updates } : expense
    ));
  };
  
  // Delete an expense
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };
  
  // Filter expenses
  const filterExpenses = (filters: {
    category?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
  }) => {
    return expenses.filter(expense => {
      // Filter by category if provided
      if (filters.category && expense.category !== filters.category) {
        return false;
      }
      
      // Filter by status if provided
      if (filters.status && expense.status !== filters.status) {
        return false;
      }
      
      // Filter by date range if provided
      if (filters.dateFrom && new Date(expense.date) < new Date(filters.dateFrom)) {
        return false;
      }
      
      if (filters.dateTo && new Date(expense.date) > new Date(filters.dateTo)) {
        return false;
      }
      
      // Filter by search term if provided
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return (
          expense.vendor.toLowerCase().includes(term) ||
          expense.description?.toLowerCase().includes(term) ||
          expense.category.toLowerCase().includes(term)
        );
      }
      
      return true;
    });
  };

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    filterExpenses,
    summary: calculateSummary(),
    monthlyData: getMonthlyData()
  };
}
