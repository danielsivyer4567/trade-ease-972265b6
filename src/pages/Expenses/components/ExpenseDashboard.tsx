
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, PieChart, DollarSign, Calendar, Receipt, Clock, AlertCircle, Check, ArrowUpRight 
} from "lucide-react";
import { useExpenseData } from '../hooks/useExpenseData';
import ExpenseList from './ExpenseList';
import { Button } from '@/components/ui/button';
import ExpenseCharts from './ExpenseCharts';

const ExpenseDashboard = () => {
  const { expenseSummary, isLoading, expensesByCategory, expensesByMonth } = useExpenseData();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">${expenseSummary.totalExpenses.toLocaleString()}</div>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{expenseSummary.pendingCount}</div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{expenseSummary.approvedCount}</div>
              <Check className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{expenseSummary.rejectedCount}</div>
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Expenses by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseCharts data={expensesByCategory} chartType="pie" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Monthly Expense Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseCharts data={expensesByMonth} chartType="bar" />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Recent Expenses
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ExpenseList expenses={expenseSummary.recentExpenses} limit={5} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseDashboard;
