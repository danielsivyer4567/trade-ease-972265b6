
import React from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseDashboard from './components/ExpenseDashboard';
import ExpenseSubmission from './components/ExpenseSubmission';
import ExpenseReports from './components/ExpenseReports';
import ExpenseCategories from './components/ExpenseCategories';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';

const ExpensesPage = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  return (
    <BaseLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Expense Management</h1>
            <p className="text-muted-foreground">Track, manage, and report your business expenses</p>
          </div>
          
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className={`${isMobile ? 'w-full grid grid-cols-2 gap-2 mb-2' : ''}`}>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="submit">Submit Expense</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <ExpenseDashboard />
            </TabsContent>
            <TabsContent value="submit">
              <ExpenseSubmission />
            </TabsContent>
            <TabsContent value="reports">
              <ExpenseReports />
            </TabsContent>
            <TabsContent value="categories">
              <ExpenseCategories />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BaseLayout>
  );
};

export default ExpensesPage;
