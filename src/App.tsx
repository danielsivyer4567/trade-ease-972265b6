
import React from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from './contexts/QueryContext';
import { Routes } from './routes';
import { NotificationProvider } from './components/notifications/NotificationContextProvider';

function App() {
  return (
    <QueryProvider>
      <NotificationProvider>
        <Routes />
        <Toaster />
      </NotificationProvider>
    </QueryProvider>
  );
}

export default App;
