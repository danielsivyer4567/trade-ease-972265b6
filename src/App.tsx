import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import Jobs from "./pages/Jobs";
import NewJob from "./pages/Jobs/NewJob";
import CustomersPage from "./pages/Customers";
import NewCustomer from "./pages/Customers/NewCustomer";
import Quotes from "./pages/Quotes";
import Invoices from "./pages/Invoices";
import BankingPage from "./pages/Banking";
import SiteAudits from "./pages/SiteAudits";
import Settings from "./pages/Settings";
import Automations from "./pages/Automations";
import { useAuthentication } from "./pages/Jobs/hooks/useAuthentication";
import { LoadingState } from "./pages/Jobs/components/LoadingState";
import { ToastProvider } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import CustomerDetail from "./pages/Customers/CustomerDetail";

function App() {
  const { isAuthenticated, isCheckingAuth } = useAuthentication();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isCheckingAuth) {
      return <LoadingState />;
    }

    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  };

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/jobs/new" element={<ProtectedRoute><NewJob /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
          <Route path="/customers/new" element={<ProtectedRoute><NewCustomer /></ProtectedRoute>} />
          <Route path="/quotes" element={<ProtectedRoute><Quotes /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
          <Route path="/banking" element={<ProtectedRoute><BankingPage /></ProtectedRoute>} />
          <Route path="/site-audits" element={<ProtectedRoute><SiteAudits /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/automations" element={<ProtectedRoute><Automations /></ProtectedRoute>} />
          <Route path="/customers/:id" element={<ProtectedRoute><CustomerDetail /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
