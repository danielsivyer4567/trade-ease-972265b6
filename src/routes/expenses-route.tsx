
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingFallback } from './loading-fallback';

// This is a placeholder component for the Expenses page
// You'll need to create this page or update this when an actual Expenses page exists
const ExpensesPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Expenses</h1>
    <p className="mt-4">Manage your business expenses here.</p>
  </div>
);

export const ExpensesRoute = () => {
  return (
    <Route element={<ProtectedRoute />}>
      <Route path="/expenses" element={
        <Suspense fallback={<LoadingFallback />}>
          <ExpensesPage />
        </Suspense>
      } />
    </Route>
  );
};
