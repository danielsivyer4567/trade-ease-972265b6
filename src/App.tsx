
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
import IntegrationsSettings from "@/pages/Settings/Integrations";
import TradeDash from './pages/TradeDash';
import NewTemplate from "./pages/Jobs/NewTemplate";
import NewJob from "./pages/Jobs/NewJob";
import NewQuote from "./pages/Quotes/NewQuote";
import NewPayment from "./pages/Payments/NewPayment";
import Workflow from "./pages/Workflow";
import Auth from "./pages/Auth";
import TermsOfService from "./pages/Settings/TermsOfService";
import Calculators from "./pages/Calculators";
import LoadsSpansCalculator from "./pages/Calculators/LoadsSpansCalculator";
import FencingCalculator from "./pages/Calculators/FencingCalculator";
import NCCCodesCalculator from "./pages/Calculators/NCCCodesCalculator";
import CalendarSync from "./pages/Calendar/CalendarSync";
import NewInvoice from "./pages/Invoices/NewInvoice";

import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Index />} />
        <Route path="/customers/*" element={<Customers />} />
        <Route path="/quotes/*" element={<Quotes />} />
        <Route path="/jobs/*" element={<Jobs />} />
        <Route path="/jobs/new-template" element={<NewTemplate />} />
        <Route path="/jobs/new" element={<NewJob />} />
        <Route path="/email/*" element={<Email />} />
        <Route path="/messaging/*" element={<Messaging />} />
        <Route path="/social/*" element={<Social />} />
        <Route path="/calendar/*" element={<Calendar />} />
        <Route path="/calendar/sync" element={<CalendarSync />} />
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
        <Route path="/settings/integrations" element={<IntegrationsSettings />} />
        <Route path="/trade-dash" element={<TradeDash />} />
        <Route path="/invoices/new" element={<NewInvoice />} />
        <Route path="/payments/new" element={<NewPayment />} />
        <Route path="/workflow" element={<Workflow />} />
        <Route path="/calculators/*" element={<Calculators />} />
        <Route path="/calculators/loads-spans" element={<LoadsSpansCalculator />} />
        <Route path="/calculators/fencing" element={<FencingCalculator />} />
        <Route path="/calculators/ncc-codes" element={<NCCCodesCalculator />} />
        <Route path="/settings/terms-of-service" element={<TermsOfService />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
