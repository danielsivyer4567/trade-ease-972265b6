
import React from "react";
import { Routes } from "./routes/index.tsx";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./components/notifications/NotificationContextProvider";
import { Suspense } from "react";
import { TabsProvider } from "./contexts/TabsContext";
import { initializeTables } from "./integrations/supabase/dbInit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

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
      <Toaster />
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
            </NotificationProvider>
          </TabsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
