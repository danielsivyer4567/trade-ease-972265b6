import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Suspense, lazy } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

// Lazy-loaded components
const LoginPage = lazy(() => import("@/pages/Auth/Login"));
const RegisterPage = lazy(() => import("@/pages/Auth/Register"));
const ForgotPasswordPage = lazy(() => import("@/pages/Auth/ForgotPassword"));
const ResetPasswordPage = lazy(() => import("@/pages/Auth/ResetPassword"));
const DashboardPage = lazy(() => import("@/pages/Dashboard"));
const JobsPage = lazy(() => import("@/pages/Jobs"));
const JobDetailsPage = lazy(() => import("@/pages/Jobs/JobDetails"));
const CustomersPage = lazy(() => import("@/pages/Customers"));
const CustomerDetailsPage = lazy(() => import("@/pages/Customers/CustomerDetails"));
const InvoicesPage = lazy(() => import("@/pages/Invoices"));
const InvoiceDetailsPage = lazy(() => import("@/pages/Invoices/InvoiceDetails"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const ProfilePage = lazy(() => import("@/pages/Settings/Profile"));
const TeamPage = lazy(() => import("@/pages/Settings/Team"));
const NotificationsPage = lazy(() => import("@/pages/Settings/Notifications"));
const IntegrationsPage = lazy(() => import("@/pages/Integrations"));
const AddIntegration = lazy(() => import("@/pages/Integrations/AddIntegration"));
const MessagingPage = lazy(() => import("@/pages/Messaging"));
const CalendarPage = lazy(() => import("@/pages/Calendar"));
const ReportsPage = lazy(() => import("@/pages/Reports"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tradeease-theme">
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* Jobs */}
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailsPage />} />
                
                {/* Customers */}
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/customers/:id" element={<CustomerDetailsPage />} />
                
                {/* Invoices */}
                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/invoices/:id" element={<InvoiceDetailsPage />} />
                
                {/* Settings */}
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/settings/profile" element={<ProfilePage />} />
                <Route path="/settings/team" element={<TeamPage />} />
                <Route path="/settings/notifications" element={<NotificationsPage />} />
                
                {/* Integrations */}
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="/integrations/add" element={<AddIntegration />} />
                
                {/* Other Pages */}
                <Route path="/messaging" element={<MessagingPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Route>

              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </Router>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
