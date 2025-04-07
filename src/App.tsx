
import React from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from './contexts/QueryContext';
import { Routes } from './routes';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from './components/notifications/NotificationContextProvider';

function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <NotificationProvider>
          <Routes />
          <Toaster />
        </NotificationProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}

export default App;
