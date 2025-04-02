
import React, { Suspense } from 'react';
import { Routes as RouterRoutes } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingFallback } from './loading-fallback';

// Import route groups
import { AuthRoutes } from './auth-routes';
import { DashboardRoutes } from './dashboard-routes';
import { CustomerRoutes } from './customer-routes';
import { JobRoutes } from './job-routes';
import { CalendarRoutes } from './calendar-routes';
import { CommunicationRoutes } from './communication-routes';
import { FinancialRoutes } from './financial-routes';
import { ActivityRoutes } from './activity-routes';
import { TeamRoutes } from './team-routes';
import { SettingsRoutes } from './settings-routes';
import { NotFoundRoute } from './not-found-route';
import { ExpensesRoute } from './expenses-route';

export function Routes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterRoutes>
        {/* Auth Routes */}
        <AuthRoutes />
        
        {/* Main Application Routes */}
        <DashboardRoutes />
        <CustomerRoutes />
        <JobRoutes />
        <CalendarRoutes />
        <CommunicationRoutes />
        <FinancialRoutes />
        <ActivityRoutes />
        <TeamRoutes />
        <SettingsRoutes />
        <ExpensesRoute />
        
        {/* 404 Route */}
        <NotFoundRoute />
      </RouterRoutes>
    </Suspense>
  );
}
