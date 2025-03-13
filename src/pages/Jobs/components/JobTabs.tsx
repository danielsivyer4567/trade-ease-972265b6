
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import type { Job } from "@/types/job";
import { StandardTabs } from "./tabs/StandardTabs";
import { ManagerTabs } from "./tabs/ManagerTabs";
import { useJobFinancials } from "../hooks/useJobFinancials";

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
  const {
    totalRevenue,
    totalCosts,
    totalBills,
    handleUpdateInvoiceTotals,
    handleUpdateCostsTotals,
    handleUpdateBillsTotals
  } = useJobFinancials();

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className={`grid ${isManager ? 'grid-cols-4 lg:grid-cols-8' : 'grid-cols-4'} mb-4`}>
        <StandardTabs 
          job={job}
          jobTimer={jobTimer}
          jobNotes={jobNotes}
          setJobNotes={setJobNotes}
          locationHistory={locationHistory}
          hasLocationPermission={hasLocationPermission}
          handleTimerToggle={handleTimerToggle}
          handleBreakToggle={handleBreakToggle}
          isTimerRunning={isTimerRunning}
          isOnBreak={isOnBreak}
        />
        
        {isManager && (
          <ManagerTabs 
            jobTimer={jobTimer}
            tabNotes={tabNotes}
            setTabNotes={setTabNotes}
            totalRevenue={totalRevenue}
            totalCosts={totalCosts}
            totalBills={totalBills}
            extractedFinancialData={extractedFinancialData}
            onUpdateBillsTotals={handleUpdateBillsTotals}
            onUpdateCostsTotals={handleUpdateCostsTotals}
            onUpdateInvoiceTotals={handleUpdateInvoiceTotals}
          />
        )}
      </TabsList>
    </Tabs>
  );
};
