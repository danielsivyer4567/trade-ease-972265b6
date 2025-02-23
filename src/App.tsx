
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import NewJob from "./pages/Jobs/NewJob";
import NewTemplate from "./pages/Jobs/NewTemplate";
import NewQuote from "./pages/Quotes/NewQuote";
import Statistics from "./pages/Statistics";
import Tasks from "./pages/Tasks";
import Settings from "./pages/Settings";
import TeamRed from "./pages/TeamRed";
import TeamBlue from "./pages/TeamBlue";
import TeamGreen from "./pages/TeamGreen";
import Notifications from "./pages/Notifications";
import Customers from "./pages/Customers";
import NewCustomer from "./pages/Customers/NewCustomer";
import CustomerDetail from "./pages/Customers/CustomerDetail";
import NewPayment from "./pages/Payments/NewPayment";
import PayRun from "./pages/Payroll/PayRun";
import NewInvoice from "./pages/Invoices/NewInvoice";
import Messaging from "./pages/Messaging";
import Integrations from "./pages/Settings/Integrations";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/new" element={<NewJob />} />
        <Route path="/jobs/template/new" element={<NewTemplate />} />
        <Route path="/quotes/new" element={<NewQuote />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/integrations" element={<Integrations />} />
        <Route path="/team-red" element={<TeamRed />} />
        <Route path="/team-blue" element={<TeamBlue />} />
        <Route path="/team-green" element={<TeamGreen />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/new" element={<NewCustomer />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/payments/new" element={<NewPayment />} />
        <Route path="/payroll/pay-run" element={<PayRun />} />
        <Route path="/invoices/new" element={<NewInvoice />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
