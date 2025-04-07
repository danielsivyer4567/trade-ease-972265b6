
import React from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from './contexts/QueryContext';
import { Routes } from './routes';

function App() {
  return (
    <QueryProvider>
      <Routes />
      <Toaster />
    </QueryProvider>
  );
}

export default App;
