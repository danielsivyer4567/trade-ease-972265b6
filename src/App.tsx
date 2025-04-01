
import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Routes } from './routes/index';
import { Analytics } from '@vercel/analytics/react';
import { QueryProvider } from '@/integrations/query/QueryProvider';
import { NotificationProvider } from '@/components/notifications/NotificationContextProvider';
import { NotificationSidebar } from '@/components/notifications/NotificationSidebar';
import { useNotifications } from '@/components/notifications/NotificationContextProvider';
import './App.css';

// Wrapper component to use the notifications context
const NotificationSidebarWrapper = () => {
  const { isNotificationOpen, closeNotifications } = useNotifications();
  return (
    <NotificationSidebar 
      isOpen={isNotificationOpen} 
      onClose={closeNotifications} 
    />
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryProvider>
          <NotificationProvider>
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
              <Routes />
              <NotificationSidebarWrapper />
            </Suspense>
            <Toaster />
            <Analytics />
          </NotificationProvider>
        </QueryProvider>
      </AuthProvider>
    </Router>
  );
}
