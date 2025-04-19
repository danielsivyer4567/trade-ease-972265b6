import React, { Suspense, useState, useEffect } from 'react';
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
import { ErrorBoundary } from 'react-error-boundary';
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

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="flex h-screen w-screen flex-col items-center justify-center p-6 text-center">
    <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
    <p className="mt-2 mb-4">{error.message || 'An unexpected error occurred'}</p>
    <button
      onClick={resetErrorBoundary}
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      Try again
    </button>
  </div>
);

const AppContent = () => {
  const [initError, setInitError] = useState(null);
  
  // Initialize database tables on mount
  useEffect(() => {
    initializeTables()
      .catch(error => {
        console.error('Failed to initialize tables:', error);
        setInitError(error);
      });
  }, []);

  // If there was an initialization error, show a message but still continue
  if (initError) {
    console.warn('App continuing despite initialization error:', initError);
  }

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
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <AppContent />
              </ErrorBoundary>
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





