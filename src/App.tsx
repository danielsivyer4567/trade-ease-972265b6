
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import TeamRed from "./pages/TeamRed";
import TeamBlue from "./pages/TeamBlue";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/team-red" element={<TeamRed />} />
        <Route path="/team-blue" element={<TeamBlue />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
