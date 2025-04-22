import React, { Suspense, useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import router from './routes/index';
import { Analytics } from '@vercel/analytics/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as SonnerToaster } from 'sonner';
import { NotificationProvider } from './components/notifications/NotificationContextProvider';
import { TabsProvider } from './contexts/TabsContext';
import { initializeTables } from './integrations/supabase/dbInit';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
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

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
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

function App() {
  const [initError, setInitError] = useState<Error | null>(null);
  
  useEffect(() => {
    initializeTables()
      .catch(error => {
        console.error('Failed to initialize tables:', error);
        setInitError(error instanceof Error ? error : new Error(String(error)));
      });
  }, []);

  if (initError) {
    console.warn('App continuing despite initialization error:', initError);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <RouterProvider 
              router={router} 
              future={{ v7_startTransition: true }} 
              fallbackElement={<LoadingFallback />}
            />
          </ErrorBoundary>
          <Toaster />
          <SonnerToaster position="bottom-right" closeButton richColors />
          <Analytics />
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

declare global {
  interface Window {
    electron?: {
      ipcRenderer: {
        send(channel: string): void;
      };
    };
  }
}

if (window.electron) {
  window.electron.ipcRenderer.send('to-main');
}





