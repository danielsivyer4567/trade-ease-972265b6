
import React from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, DollarSign, FileText, PieChart, Calendar, Clock, Tag } from "lucide-react";

const ExpensesPage = () => {
  return (
    <BaseLayout>
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Receipt className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Expenses</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Recent Expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Recent Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View and manage your most recent business expenses.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">5 New Expenses</span>
                <button className="text-primary text-sm font-medium">View All</button>
              </div>
            </CardContent>
          </Card>
          
          {/* Expense Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Expense Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Generate and download expense reports for accounting.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Last Report: June 2023</span>
                <button className="text-primary text-sm font-medium">Generate</button>
              </div>
            </CardContent>
          </Card>
          
          {/* Expense Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Expense Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Analyze spending patterns and track business expenses.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">12% decrease from last month</span>
                <button className="text-primary text-sm font-medium">View Details</button>
              </div>
            </CardContent>
          </Card>
          
          {/* Recurring Expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recurring Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage and track your recurring monthly expenses.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">3 Upcoming This Week</span>
                <button className="text-primary text-sm font-medium">Manage</button>
              </div>
            </CardContent>
          </Card>
          
          {/* Expense Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Review and approve expense submissions from team members.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">8 Waiting for Approval</span>
                <button className="text-primary text-sm font-medium">Review</button>
              </div>
            </CardContent>
          </Card>
          
          {/* Expense Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Expense Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Organize and categorize expenses for better tracking.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">14 Active Categories</span>
                <button className="text-primary text-sm font-medium">Customize</button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ExpensesPage;
