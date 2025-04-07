import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryProvider } from './contexts/QueryContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { WorkflowTest } from './pages/Tests';

// Lazy-loaded components
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Customers = React.lazy(() => import('./pages/Customers'));
const CustomerDetail = React.lazy(() => import('./pages/Customers/CustomerDetail'));
const Jobs = React.lazy(() => import('./pages/Jobs'));
const JobDetail = React.lazy(() => import('./pages/Jobs/JobDetail'));
const Quotes = React.lazy(() => import('./pages/Quotes'));
const QuoteDetail = React.lazy(() => import('./pages/Quotes/QuoteDetail'));
const Invoices = React.lazy(() => import('./pages/Invoices'));
const InvoiceDetail = React.lazy(() => import('./pages/Invoices/InvoiceDetail'));
const Calendar = React.lazy(() => import('./pages/Calendar'));
const Messages = React.lazy(() => import('./pages/Messages'));
const Forms = React.lazy(() => import('./pages/Forms'));
const FormBuilder = React.lazy(() => import('./pages/Forms/FormBuilder'));
const FormDetail = React.lazy(() => import('./pages/Forms/FormDetail'));
const FormResponse = React.lazy(() => import('./pages/Forms/FormResponse'));
const Workflow = React.lazy(() => import('./pages/Workflow'));
const Automations = React.lazy(() => import('./pages/Automations'));
const Reports = React.lazy(() => import('./pages/Reports'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <QueryProvider>
      <Routes>
        <Route path="/login" element={<React.Suspense fallback="Loading..."><Login /></React.Suspense>} />
        <Route path="/register" element={<React.Suspense fallback="Loading..."><Register /></React.Suspense>} />
        
        <Route path="/" element={<React.Suspense fallback="Loading..."><ProtectedRoute><Dashboard /></ProtectedRoute></React.Suspense>} />
        <Route path="/settings" element={<React.Suspense fallback="Loading..."><ProtectedRoute><Settings /></ProtectedRoute></React.Suspense>} />
        <Route path="/profile" element={<React.Suspense fallback="Loading..."><ProtectedRoute><Profile /></ProtectedRoute></React.Suspense>} />
        
        <Route path="/customers" element={<React.Suspense fallback="Loading..."><ProtectedRoute><Customers /></ProtectedRoute></React.Suspense>} />
        <Route path="/customers/:id" element={<React.Suspense fallback="Loading..."><ProtectedRoute><CustomerDetail /></ProtectedRoute></React.Suspense>} />
        
        <Route path="/jobs" element={<React.Suspense fallback="Loading..."><ProtectedRoute><Jobs /></ProtectedRoute></React.Suspense>} />
        <Route path="/jobs/:id" element={<React.Suspense fallback="Loading..."><ProtectedRoute><JobDetail /></ProtectedRoute></React.Suspense>} />
        
        <Route path="/quotes" element={<React.Suspense fallback="Loading..."><ProtectedRoute><Quotes /></ProtectedRoute></React.Suspense>} />
        <Route path="/quotes/:id" element={<React.Suspense fallback="Loading..."><ProtectedRoute><QuoteDetail /></ProtectedRoute></React.Suspense>} />
        
        <Route path="/invoices" element={<React.Suspense fallback="Loading..."><ProtectedRoute><Invoices /></ProtectedRoute></React.Suspense>} />
        <Route path="/invoices/:id" element={<React.Suspense fallback="Loading..."><ProtectedRoute><InvoiceDetail /></ProtectedRoute></React.Suspense>} />
        
        <Route path="/calendar" element={<React.Suspense fallback="Loading..."><ProtectedRoute><Calendar /></ProtectedRoute></React.Suspense>} />
        <Route path="/messages" element={<React.Suspense fallback="Loading..."><ProtectedRoute><Messages /></ProtectedRoute></React.Suspense>} />
        
        <Route path="/forms" element={<React.Suspense fallback="Loading..."><ProtectedRoute><Forms /></ProtectedRoute></React.Suspense>} />
        <Route path="/forms/builder" element={<React.Suspense fallback="Loading..."><ProtectedRoute><FormBuilder /></ProtectedRoute></React.Suspense>} />
        <Route path="/forms/:id" element={<React.Suspense fallback="Loading..."><ProtectedRoute><FormDetail /></ProtectedRoute></React.Suspense>} />
        <Route path="/forms/:id/response" element={<React.Suspense fallback="Loading..."><ProtectedRoute><FormResponse /></ProtectedRoute></React.Suspense>} />
        
        <Route path="/workflow" element={<React.Suspense fallback="Loading..."><ProtectedRoute><Workflow /></ProtectedRoute></React.Suspense>} />
        <Route path="/automations" element={<React.Suspense fallback="Loading..."><ProtectedRoute><Automations /></ProtectedRoute></React.Suspense>} />
        <Route path="/reports" element={<React.Suspense fallback="Loading..."><ProtectedRoute><Reports /></ProtectedRoute></React.Suspense>} />
        
        {/* Add the new test route */}
        <Route path="/tests/workflow" element={<React.Suspense fallback="Loading..."><ProtectedRoute><WorkflowTest /></ProtectedRoute></React.Suspense>} />
        
        <Route path="*" element={<React.Suspense fallback="Loading..."><NotFound /></React.Suspense>} />
      </Routes>
      <Toaster />
    </QueryProvider>
  );
}

export default App;
