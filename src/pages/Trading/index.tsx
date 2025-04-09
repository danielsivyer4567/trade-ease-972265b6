
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TradeDashboard from './components/TradeDashboard';
import { Navigate } from 'react-router-dom';

const TradingPage = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <TradeDashboard />
    </div>
  );
};

export default TradingPage;
