
import { Routes } from "./routes/index.tsx";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./components/notifications/NotificationContextProvider";
import { BrowserRouter } from "react-router-dom";
import { Suspense } from "react";

const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthProvider>
        <NotificationProvider>
          <Toaster />
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
