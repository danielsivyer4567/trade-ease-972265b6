
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
import Tasks from "@/pages/Tasks";
import Statistics from "@/pages/Statistics";
import Settings from "@/pages/Settings";
import OfficeStaff from "@/pages/Settings/OfficeStaff";
import TradeRates from "@/pages/Settings/TradeRates";
import BillsPurchaseOrders from "@/pages/Settings/BillsPurchaseOrders";
import TimeSheets from "@/pages/Settings/TimeSheets";
import OnsiteStaff from "@/pages/Settings/OnsiteStaff";
import Security2FA from "@/pages/Settings/Security2FA";
import Estimates from "@/pages/Settings/Estimates";
import CalendarScheduling from "@/pages/Settings/CalendarScheduling";
import PriceLists from "@/pages/Settings/PriceLists";
import TradePlanDetails from "@/pages/Settings/TradePlanDetails";
import Payments from "@/pages/Settings/Payments";
import CustomerPortfolios from "@/pages/Settings/CustomerPortfolios";
import ApiIntegrations from "@/pages/Settings/ApiIntegrations";
import JobsSettings from "@/pages/Settings/JobsSettings";
import IntegrationsSettings from "@/pages/Settings/IntegrationsSettings";
import Inquiries from "@/pages/Settings/Inquiries";
import EmailSettings from "@/pages/Settings/EmailSettings";
import DocumentStyles from "@/pages/Settings/DocumentStyles";
import CompanyInformation from "@/pages/Settings/CompanyInformation";
import ReferFriend from "@/pages/Settings/ReferFriend";
import AIAssistantSettings from "@/pages/Settings/AIAssistantSettings";

import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/customers/*" element={<Customers />} />
        <Route path="/quotes/*" element={<Quotes />} />
        <Route path="/jobs/*" element={<Jobs />} />
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
        <Route path="/tasks/*" element={<Tasks />} />
        <Route path="/statistics/*" element={<Statistics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/trade-rates" element={<TradeRates />} />
        <Route path="/settings/bills-purchase-orders" element={<BillsPurchaseOrders />} />
        <Route path="/settings/time-sheets" element={<TimeSheets />} />
        <Route path="/settings/office-staff" element={<OfficeStaff />} />
        <Route path="/settings/on-site-staff" element={<OnsiteStaff />} />
        <Route path="/settings/contractors" element={<Settings />} />
        <Route path="/settings/security-2fa" element={<Security2FA />} />
        <Route path="/settings/estimates" element={<Estimates />} />
        <Route path="/settings/calendar-scheduling" element={<CalendarScheduling />} />
        <Route path="/settings/price-lists" element={<PriceLists />} />
        <Route path="/settings/trade-ease-plan-details" element={<TradePlanDetails />} />
        <Route path="/settings/payments" element={<Payments />} />
        <Route path="/settings/customer-portfolios" element={<CustomerPortfolios />} />
        <Route path="/settings/api-integrations" element={<ApiIntegrations />} />
        <Route path="/settings/jobs" element={<JobsSettings />} />
        <Route path="/settings/integrations" element={<IntegrationsSettings />} />
        <Route path="/settings/inquiries" element={<Inquiries />} />
        <Route path="/settings/email" element={<EmailSettings />} />
        <Route path="/settings/document-styles" element={<DocumentStyles />} />
        <Route path="/settings/company-information" element={<CompanyInformation />} />
        <Route path="/settings/refer-a-friend" element={<ReferFriend />} />
        <Route path="/settings/ai-assistant-settings" element={<AIAssistantSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
