
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';

import NotFound from "@/pages/NotFound";
import Jobs from "@/pages/Jobs";
import Customers from "@/pages/Customers";
import Quotes from "@/pages/Quotes";
import Email from "@/pages/Email";
import Messaging from "@/pages/Messaging";
import Social from "@/pages/Social";
import Index from "@/pages/Index";
import Calendar from "@/pages/Calendar";
import Database from "@/pages/Database";
import AIFeatures from "@/pages/AIFeatures";
import Integrations from "@/pages/Integrations";
import Notifications from "@/pages/Notifications";
import Referrals from "@/pages/Referrals";
import TeamRed from "@/pages/TeamRed";
import TeamBlue from "@/pages/TeamBlue";
import TeamGreen from "@/pages/TeamGreen";
import TeamNew from "@/pages/TeamNew";
import Tasks from "@/pages/Tasks";
import Statistics from "@/pages/Statistics";
import Settings from "@/pages/Settings";
import OfficeStaff from "@/pages/Settings/OfficeStaff";
import TradeRates from "@/pages/Settings/TradeRates";
import BillsPurchaseOrders from "@/pages/Settings/BillsPurchaseOrders";
import AIAssistantSettings from "@/pages/Settings/AIAssistantSettings";
import NotificationsSettings from "@/pages/Settings/Notifications";
import TradeDash from './pages/TradeDash';
import NewTemplate from "./pages/Jobs/NewTemplate";
import NewQuote from "./pages/Quotes/NewQuote";

import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/customers/*" element={<Customers />} />
        <Route path="/quotes/*" element={<Quotes />} />
        <Route path="/quotes/new" element={<NewQuote />} />
        <Route path="/jobs/*" element={<Jobs />} />
        <Route path="/jobs/new-template" element={<NewTemplate />} />
        <Route path="/email/*" element={<Email />} />
        <Route path="/messaging/*" element={<Messaging />} />
        <Route path="/social/*" element={<Social />} />
        <Route path="/calendar/*" element={<Calendar />} />
        <Route path="/database/*" element={<Database />} />
        <Route path="/ai-features/*" element={<AIFeatures />} />
        <Route path="/integrations/*" element={<Integrations />} />
        <Route path="/notifications/*" element={<Notifications />} />
        <Route path="/referrals/*" element={<Referrals />} />
        <Route path="/team-red/*" element={<TeamRed />} />
        <Route path="/team-blue/*" element={<TeamBlue />} />
        <Route path="/team-green/*" element={<TeamGreen />} />
        <Route path="/team-new/*" element={<TeamNew />} />
        <Route path="/tasks/*" element={<Tasks />} />
        <Route path="/statistics/*" element={<Statistics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/trade-rates" element={<TradeRates />} />
        <Route path="/settings/bills-purchase-orders" element={<BillsPurchaseOrders />} />
        <Route path="/settings/office-staff" element={<OfficeStaff />} />
        <Route path="/settings/ai-assistant-settings" element={<AIAssistantSettings />} />
        <Route path="/settings/notifications" element={<NotificationsSettings />} />
        <Route path="/trade-dash" element={<TradeDash />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
