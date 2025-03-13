
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Calendar, Clock, Receipt, DollarSign, ScrollText, Calculator, Wallet } from "lucide-react";
import { JobDetailsTab } from "./tabs/JobDetailsTab";
import { JobNotesTab } from "./tabs/JobNotesTab";
import { JobCalendarTab } from "./tabs/JobCalendarTab";
import { JobTimerTab } from "./tabs/JobTimerTab";
import { JobFinancialsTab } from "./tabs/JobFinancialsTab";
import { JobBillsTab } from "./tabs/JobBillsTab";
import { JobCostsTab } from "./tabs/JobCostsTab";
import { JobInvoicesTab } from "./tabs/JobInvoicesTab";
import type { Job } from "@/types/job";
import { useState } from "react";

interface JobTabsProps {
  job: Job;
  isManager: boolean;
  jobTimer: number;
  jobNotes: string;
  setJobNotes: (notes: string) => void;
  tabNotes: Record<string, string>;
  setTabNotes: (notes: Record<string, string>) => void;
  locationHistory: Array<{timestamp: number; coords: [number, number]}>;
  hasLocationPermission: boolean | null;
  handleTimerToggle: () => void;
  handleBreakToggle: () => void;
  isTimerRunning: boolean;
  isOnBreak: boolean;
  extractedFinancialData?: any[];
}

export const JobTabs = ({
  job,
  isManager,
  jobTimer,
  jobNotes,
  setJobNotes,
  tabNotes,
  setTabNotes,
  locationHistory,
  hasLocationPermission,
  handleTimerToggle,
  handleBreakToggle,
  isTimerRunning,
  isOnBreak,
  extractedFinancialData = []
}: JobTabsProps) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [totalBills, setTotalBills] = useState(0);

  const handleUpdateInvoiceTotals = (amount: number) => {
    setTotalRevenue(prev => prev + amount);
  };

  const handleUpdateCostsTotals = (amount: number) => {
    setTotalCosts(prev => prev + amount);
  };

  const handleUpdateBillsTotals = (amount: number) => {
    setTotalBills(prev => prev + amount);
  };

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="notes">
          <FileText className="w-4 h-4 mr-2" />
          Notes
        </TabsTrigger>
        <TabsTrigger value="calendar">
          <Calendar className="w-4 h-4 mr-2" />
          Calendar
        </TabsTrigger>
        <TabsTrigger value="timer">
          <Clock className="w-4 h-4 mr-2" />
          Timer
        </TabsTrigger>
        {isManager && (
          <>
            <TabsTrigger value="bills">
              <Receipt className="w-4 h-4 mr-2" />
              Bills
            </TabsTrigger>
            <TabsTrigger value="costs">
              <Calculator className="w-4 h-4 mr-2" />
              Costs
            </TabsTrigger>
            <TabsTrigger value="invoices">
              <ScrollText className="w-4 h-4 mr-2" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="financials">
              <Wallet className="w-4 h-4 mr-2" />
              Financials
            </TabsTrigger>
          </>
        )}
      </TabsList>

      <JobDetailsTab job={job} />
      <JobNotesTab notes={jobNotes} setNotes={setJobNotes} />
      <JobCalendarTab job={job} />
      <JobTimerTab 
        jobTimer={jobTimer}
        hasLocationPermission={hasLocationPermission}
        handleTimerToggle={handleTimerToggle}
        handleBreakToggle={handleBreakToggle}
        isTimerRunning={isTimerRunning}
        isOnBreak={isOnBreak}
        locationHistory={locationHistory}
      />
      {isManager && (
        <>
          <JobBillsTab
            tabNotes={tabNotes}
            setTabNotes={setTabNotes}
            onUpdateTotals={handleUpdateBillsTotals}
          />
          <JobCostsTab
            tabNotes={tabNotes}
            setTabNotes={setTabNotes}
            onUpdateTotals={handleUpdateCostsTotals}
          />
          <JobInvoicesTab
            tabNotes={tabNotes}
            setTabNotes={setTabNotes}
            onUpdateTotals={handleUpdateInvoiceTotals}
          />
          <JobFinancialsTab
            jobTimer={jobTimer}
            tabNotes={tabNotes}
            setTabNotes={setTabNotes}
            totalRevenue={totalRevenue}
            totalCosts={totalCosts + totalBills}
            extractedFinancialData={extractedFinancialData}
          />
        </>
      )}
    </Tabs>
  );
}
