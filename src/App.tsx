
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Statistics from "./pages/Statistics";
import Jobs from "./pages/Jobs";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import TeamRed from "./pages/TeamRed";
import TeamBlue from "./pages/TeamBlue";
import TeamGreen from "./pages/TeamGreen";
import AIFeatures from "./pages/AIFeatures";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/team-red" element={<TeamRed />} />
        <Route path="/team-blue" element={<TeamBlue />} />
        <Route path="/team-green" element={<TeamGreen />} />
        <Route path="/ai-features" element={<AIFeatures />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
