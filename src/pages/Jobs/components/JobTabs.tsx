
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Job } from "@/types/job";
import { StandardTabs } from "./tabs/StandardTabs";
import { ManagerTabs } from "./tabs/ManagerTabs";
import { useJobFinancials } from "../hooks/useJobFinancials";
import { useIsMobile } from "@/hooks/use-mobile";

interface JobTabsProps {
  job: Job;
  isManager: boolean;
  jobTimer: number;
  jobNotes: string;
  setJobNotes: (notes: string) => void;
  tabNotes: Record<string, string>;
  setTabNotes: (notes: Record<string, string>) => void;
  locationHistory: Array<{
    timestamp: number;
    coords: [number, number];
  }>;
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
  const isMobile = useIsMobile();
  const {
    totalRevenue,
    totalCosts,
    totalBills,
    handleUpdateInvoiceTotals,
    handleUpdateCostsTotals,
    handleUpdateBillsTotals
  } = useJobFinancials();

  return (
    <Tabs defaultValue="details" className="w-full flex flex-col">
      <div className="w-full overflow-hidden mb-2 sticky top-0 z-30 bg-white">
        <TabsList className="w-full flex overflow-x-auto py-2">
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
      </div>
      
      <div className="w-full mt-4 overflow-hidden bg-white z-10 relative">
        {/* TabsContent components are rendered within StandardTabs and ManagerTabs */}
      </div>
    </Tabs>
  );
};
