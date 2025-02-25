import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import NewJob from "./pages/Jobs/NewJob";
import JobDetails from "./pages/Jobs/JobDetails";
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
import TradeRatesCalculator from "./pages/Settings/TradeRatesCalculator";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/jobs/new",
    element: <NewJob />,
  },
  {
    path: "/jobs/:id",
    element: <JobDetails />,
  },
  {
    path: "/jobs/template/new",
    element: <NewTemplate />,
  },
  {
    path: "/quotes/new",
    element: <NewQuote />,
  },
  {
    path: "/statistics",
    element: <Statistics />,
  },
  {
    path: "/tasks",
    element: <Tasks />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/settings/integrations",
    element: <Integrations />,
  },
  {
    path: "/team-red",
    element: <TeamRed />,
  },
  {
    path: "/team-blue",
    element: <TeamBlue />,
  },
  {
    path: "/team-green",
    element: <TeamGreen />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/customers",
    element: <Customers />,
  },
  {
    path: "/customers/new",
    element: <NewCustomer />,
  },
  {
    path: "/customers/:id",
    element: <CustomerDetail />,
  },
  {
    path: "/payments/new",
    element: <NewPayment />,
  },
  {
    path: "/payroll/pay-run",
    element: <PayRun />,
  },
  {
    path: "/invoices/new",
    element: <NewInvoice />,
  },
  {
    path: "/messaging",
    element: <Messaging />,
  },
  {
    path: "/settings/trade-rates/calculator",
    element: <TradeRatesCalculator />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
