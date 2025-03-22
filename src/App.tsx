import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Routes } from './routes/index';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes />
        <Toaster />
        <Analytics />
      </AuthProvider>
    </Router>
  );
}
