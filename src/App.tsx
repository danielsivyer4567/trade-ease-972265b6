import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Statistics from "./pages/Statistics";
import Jobs from "./pages/Jobs";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";
import Customers from "./pages/Customers";
import Quotes from "./pages/Quotes";
import Messaging from "./pages/Messaging";
import Email from "./pages/Email";
import AIFeatures from "./pages/AIFeatures";
import Integrations from "./pages/Integrations";
import Social from "./pages/Social";
import Referrals from "./pages/Referrals";
import Database from "./pages/Database";
import Settings from "./pages/Settings";
import TeamRed from "./pages/TeamRed";
import TeamBlue from "./pages/TeamBlue";
import TeamGreen from "./pages/TeamGreen";
import CalendarPage from "./pages/Calendar";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/email" element={<Email />} />
        <Route path="/ai-features" element={<AIFeatures />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/social" element={<Social />} />
        <Route path="/referrals" element={<Referrals />} />
        <Route path="/database" element={<Database />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/team-red" element={<TeamRed />} />
        <Route path="/team-blue" element={<TeamBlue />} />
        <Route path="/team-green" element={<TeamGreen />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
