
export interface Expense {
  id: string;
  date: string;
  vendor: string;
  category: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
  receipt?: string;
  submittedBy?: string;
  approvedBy?: string;
  rejectedBy?: string;
  notes?: string;
  tags?: string[];
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  budgetLimit?: number;
  isActive: boolean;
  icon?: string;
  budget?: number;
}

export interface ExpenseReport {
  id: string;
  name: string;
  dateRange: {
    start: string;
    end: string;
  };
  totalAmount: number;
  expenseCount: number;
  createdAt: string;
  status: 'draft' | 'pending' | 'approved' | 'submitted';
  expenses: string[];
}

export interface ExpenseSummary {
  totalExpenses: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  recentExpenses: Expense[];
  byCategory?: CategoryData[];
}

export interface CategoryData {
  name: string;
  value: number;
  color?: string;
}

export interface MonthlyData {
  name: string;
  value: number;
}
