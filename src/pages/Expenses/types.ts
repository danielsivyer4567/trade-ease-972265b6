
export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO date string
  vendor: string;
  receipt?: string; // URL to receipt image
  status: 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
  approvedBy?: string;
  notes?: string;
  paymentMethod?: string;
  tags?: string[];
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  budget?: number;
  color?: string;
  icon?: string;
}

export interface ExpenseSummary {
  totalExpenses: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  byCategory: Record<string, number>;
  recentExpenses: Expense[];
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
  status: 'draft' | 'submitted' | 'approved';
  expenses: string[]; // Array of expense IDs
}

export interface ExpenseFilters {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  status?: string;
  vendor?: string;
  searchTerm?: string;
}
