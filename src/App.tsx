import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Routes } from './routes/index';
import { Analytics } from '@vercel/analytics/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as SonnerToaster } from 'sonner';
import { NotificationProvider } from './components/notifications/NotificationContextProvider';
import { TabsProvider } from './contexts/TabsContext';
import { initializeTables } from './integrations/supabase/dbInit';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const AppContent = () => {
  // Initialize database tables on mount
  React.useEffect(() => {
    initializeTables().catch(console.error);
  }, []);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes />
    </Suspense>
  );
};

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TabsProvider>
            <NotificationProvider>
              <AppContent />
              <Toaster />
              <SonnerToaster position="bottom-right" closeButton richColors />
              <Analytics />
            </NotificationProvider>
          </TabsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;

// Add type declaration for electron
declare global {
  interface Window {
    electron?: {
      ipcRenderer: {
        send(channel: string): void;
      };
    };
  }
}

// Send to main process
if (window.electron) {
  window.electron.ipcRenderer.send('to-main');
}





