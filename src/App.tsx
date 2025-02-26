
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/toast';
import { Toaster } from './components/ui/toaster';
import { SidebarProvider } from './components/ui/sidebar';
import { AppSidebar } from './components/ui/AppSidebar';
import Index from './pages/Index';
import AIFeatures from './pages/AIFeatures';
import NotFound from './pages/NotFound';
import Calendar from './pages/Calendar';
import Customers from './pages/Customers';
import Database from './pages/Database';
import Email from './pages/Email';
import Integrations from './pages/Integrations';
import Jobs from './pages/Jobs';
import Messaging from './pages/Messaging';
import Quotes from './pages/Quotes';
import Referrals from './pages/Referrals';
import Settings from './pages/Settings';
import Social from './pages/Social';
import Statistics from './pages/Statistics';
import Tasks from './pages/Tasks';
import Notifications from './pages/Notifications';

function App() {
  return (
    <Router>
      <ToastProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/ai-features" element={<AIFeatures />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/database" element={<Database />} />
                <Route path="/email" element={<Email />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/messaging" element={<Messaging />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/referrals" element={<Referrals />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/social" element={<Social />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
          <Toaster />
        </SidebarProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
