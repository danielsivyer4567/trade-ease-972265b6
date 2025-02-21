
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Statistics from "./pages/Statistics";
import Jobs from "./pages/Jobs";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/Settings";
import TradeRates from "./pages/Settings/TradeRates";
import ContractorsPage from "./pages/Settings/Contractors";
import TeamRed from "./pages/TeamRed";
import TeamBlue from "./pages/TeamBlue";
import TeamGreen from "./pages/TeamGreen";
import AIFeatures from "./pages/AIFeatures";
import CustomersPage from "./pages/Customers";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/trade-rates" element={<TradeRates />} />
        <Route path="/settings/contractors" element={<ContractorsPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/team-red" element={<TeamRed />} />
        <Route path="/team-blue" element={<TeamBlue />} />
        <Route path="/team-green" element={<TeamGreen />} />
        <Route path="/ai-features" element={<AIFeatures />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
