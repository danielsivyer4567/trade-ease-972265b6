
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Routes } from './routes/index';
import { Analytics } from '@vercel/analytics/react';
import { QueryProvider } from '@/integrations/query/QueryProvider';
import './App.css';
import { Suspense } from 'react';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryProvider>
          <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
            <Routes />
          </Suspense>
          <Toaster />
          <Analytics />
        </QueryProvider>
      </AuthProvider>
    </Router>
  );
}
