
import { useState } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Jobs from "./pages/Jobs";
import NewJob from "./pages/Jobs/NewJob";
import CustomersPage from "./pages/Customers";
import NewCustomer from "./pages/Customers/NewCustomer";
import Quotes from "./pages/Quotes";
import BankingPage from "./pages/Banking";
import SiteAudits from "./pages/SiteAudits";
import Settings from "./pages/Settings";
import Automations from "./pages/Automations";
import { useAuthentication } from "./pages/Jobs/hooks/useAuthentication";
import { LoadingState } from "./pages/Jobs/components/LoadingState";
import { Toaster } from "@/components/ui/toaster";
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
import { QuotesInvoicesPage } from "./pages/QuotesInvoices";
import NewInvoice from "./pages/Invoices/NewInvoice";

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
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Using the Dashboard page as home since Home is missing */}
          <Route path="/" element={<div className="p-6">Welcome to Trade App</div>} />
          <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
          <Route path="/jobs/new" element={<ProtectedRoute><NewJob /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
          <Route path="/customers/new" element={<ProtectedRoute><NewCustomer /></ProtectedRoute>} />
          <Route path="/quotes" element={<ProtectedRoute><Quotes /></ProtectedRoute>} />
          <Route path="/quotes-invoices" element={<ProtectedRoute><QuotesInvoicesPage /></ProtectedRoute>} />
          <Route path="/invoices/new" element={<ProtectedRoute><NewInvoice /></ProtectedRoute>} />
          <Route path="/banking" element={<ProtectedRoute><BankingPage /></ProtectedRoute>} />
          <Route path="/site-audits" element={<ProtectedRoute><SiteAudits /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/automations" element={<ProtectedRoute><Automations /></ProtectedRoute>} />
          <Route path="/customers/:id" element={<ProtectedRoute><CustomerDetail /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
