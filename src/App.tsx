
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import NewJob from "@/pages/Jobs/NewJob";
import NewTemplate from "@/pages/Jobs/NewTemplate";
import Jobs from "@/pages/Jobs";
import Customers from "@/pages/Customers";
import CustomerDetail from "@/pages/Customers/CustomerDetail";
import NewCustomer from "@/pages/Customers/NewCustomer";
import TeamRed from "@/pages/TeamRed";
import TeamBlue from "@/pages/TeamBlue";
import TeamGreen from "@/pages/TeamGreen";
import Calendar from "@/pages/Calendar";
import Statistics from "@/pages/Statistics";
import AIFeatures from "@/pages/AIFeatures";
import Settings from "@/pages/Settings";
import Notifications from "@/pages/Notifications";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/new" element={<NewJob />} />
          <Route path="/jobs/templates/new" element={<NewTemplate />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/customers/new" element={<NewCustomer />} />
          <Route path="/team-red" element={<TeamRed />} />
          <Route path="/team-blue" element={<TeamBlue />} />
          <Route path="/team-green" element={<TeamGreen />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/ai-features" element={<AIFeatures />} />
          <Route path="/settings/*" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
