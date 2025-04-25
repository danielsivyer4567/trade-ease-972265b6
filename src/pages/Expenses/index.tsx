import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ExpensesPage = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Expenses Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to the Expenses management section. This page will allow you to track, categorize, and manage your business expenses.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesPage;
