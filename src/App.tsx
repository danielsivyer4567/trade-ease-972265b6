
import React from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from './contexts/QueryContext';
import { Routes } from './routes';
import { BrowserRouter } from 'react-router-dom';
import { NotificationContextProvider } from './components/notifications/NotificationContextProvider';

function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <NotificationContextProvider>
          <Routes />
          <Toaster />
        </NotificationContextProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}

export default App;
