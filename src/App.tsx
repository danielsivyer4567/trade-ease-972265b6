
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
import { LoadingState } from "./pages/Jobs/components/LoadingState";
import { Toaster } from "@/components/ui/toaster";
import CustomerDetail from "./pages/Customers/CustomerDetail";
import { QuotesInvoicesPage } from "./pages/QuotesInvoices";
import NewInvoice from "./pages/Invoices/NewInvoice";
// Import the useAuthentication hook properly
import { useAuthentication } from "./pages/Jobs/hooks/useAuthentication";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

// Move all route handling to a separate component that's inside BrowserRouter
function AppRoutes() {
  // Now useAuthentication is used inside the Router context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Use the properly imported useAuthentication hook
  const { isAuthenticated, isCheckingAuth } = useAuthentication();

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
    <Routes>
      {/* Using a simple welcome page as home since Home component is missing */}
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
  );
}

export default App;
