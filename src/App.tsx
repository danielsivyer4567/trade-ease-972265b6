import React, { Suspense, useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { createRouter } from './routes/index';
import { Analytics } from '@vercel/analytics/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as SonnerToaster } from 'sonner';
import { NotificationProvider } from './components/notifications/NotificationContextProvider';
import { WorkflowDarkModeProvider } from './contexts/WorkflowDarkModeContext';
import { initializeTables } from './integrations/supabase/dbInit';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import './pages/Workflow/components/workflow.css';

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

const ErrorFallbackUI = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center p-6 text-center">
    <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
    <p className="mt-2 mb-4">The application encountered an unexpected error</p>
    <button
      onClick={() => window.location.reload()}
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      Reload App
    </button>
  </div>
);

// Base UI components that don't depend on router
const AppUIComponents = ({ children = null }) => (
  <WorkflowDarkModeProvider>
    {children}
    <Toaster />
    <SonnerToaster position="bottom-right" closeButton richColors />
    <Analytics />
  </WorkflowDarkModeProvider>
);

function App() {
  const [initError, setInitError] = useState(null);
  const router = createRouter();
  
  useEffect(() => {
    console.log('App: Starting initialization...');
    initializeTables()
      .then(() => {
        console.log('App: Tables initialized successfully');
      })
      .catch(error => {
        console.error('App: Failed to initialize tables:', error);
        setInitError(error);
      });
  }, []);

  console.log('App: Rendering with router:', router);

  if (initError) {
    console.warn('App: Continuing despite initialization error:', initError);
  }

  return (
    <ErrorBoundary fallback={<ErrorFallbackUI />}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <AppUIComponents>
              <Suspense fallback={<LoadingFallback />}>
                <RouterProvider router={router} />
              </Suspense>
            </AppUIComponents>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

// Type definition for Electron
declare global {
  interface Window {
    electron?: {
      ipcRenderer: {
        send(channel: string, ...args: any[]): void;
        on(channel: string, func: (...args: any[]) => void): void;
        once(channel: string, func: (...args: any[]) => void): void;
        invoke(channel: string, ...args: any[]): Promise<any>;
      };
    };
  }
}

// Only try to communicate with Electron if it's available
// This prevents errors when running in a browser environment
if (typeof window !== 'undefined' && window.electron && window.electron.ipcRenderer) {
  try {
    window.electron.ipcRenderer.invoke('to-main')
      .then(response => {
        console.log('Received response from main process:', response);
      })
      .catch(error => {
        console.error('Error communicating with main process:', error);
      });
  } catch (error) {
    console.error('Failed to communicate with Electron main process:', error);
  }
}





