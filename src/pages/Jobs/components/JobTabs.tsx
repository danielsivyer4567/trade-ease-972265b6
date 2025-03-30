import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs";
import type { Job } from "@/types/job";
import { StandardTabs } from "./tabs/StandardTabs";
import { ManagerTabs } from "./tabs/ManagerTabs";
import { useJobFinancials } from "../hooks/useJobFinancials";
import { useIsMobile } from "@/hooks/use-mobile";
import { JobDetailsTab } from "./tabs/JobDetailsTab";
import { JobNotesTab } from "./tabs/JobNotesTab";
import { JobCalendarTab } from "./tabs/JobCalendarTab";
import { JobTimerTab } from "./tabs/JobTimerTab";
import { JobBillsTab } from "./tabs/JobBillsTab";
import { JobCostsTab } from "./tabs/JobCostsTab";
import { JobFinancialsTab } from "./tabs/JobFinancialsTab";
import { JobProgressTab } from "./tabs/JobProgressTab";
import { JobCustomerConversationsTab } from "./tabs/JobCustomerConversationsTab";
import { FinancialData } from "../hooks/financial-data/types";

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
  extractedFinancialData?: FinancialData[];
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
      <div className="w-full overflow-hidden mb-6 sticky top-0 z-30 bg-white">
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
            includeProgressTab={true}
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
      
      <div className="w-full bg-white z-10 relative mb-8">
        <TabsContent value="details" className="mt-0 px-1 relative">
          <JobDetailsTab job={job} />
        </TabsContent>
        
        <TabsContent value="notes" className="mt-0 px-1 relative">
          <JobNotesTab notes={jobNotes} setNotes={setJobNotes} />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-0 px-1 relative">
          <JobCalendarTab job={job} />
        </TabsContent>
        
        <TabsContent value="timer" className="mt-0 px-1 relative">
          <JobTimerTab 
            jobTimer={jobTimer} 
            hasLocationPermission={hasLocationPermission} 
            handleTimerToggle={handleTimerToggle} 
            handleBreakToggle={handleBreakToggle} 
            isTimerRunning={isTimerRunning} 
            isOnBreak={isOnBreak} 
            locationHistory={locationHistory} 
          />
        </TabsContent>
        
        <TabsContent value="progress" className="mt-0 px-1 relative">
          <JobProgressTab />
        </TabsContent>
        
        {isManager && (
          <>
            <TabsContent value="bills" className="mt-0 px-1 relative">
              <JobBillsTab
                tabNotes={tabNotes}
                setTabNotes={setTabNotes}
                onUpdateTotals={handleUpdateBillsTotals}
              />
            </TabsContent>
            
            <TabsContent value="costs" className="mt-0 px-1 relative">
              <JobCostsTab
                tabNotes={tabNotes}
                setTabNotes={setTabNotes}
                onUpdateTotals={handleUpdateCostsTotals}
              />
            </TabsContent>
            
            <TabsContent value="financials" className="mt-0 px-1 relative">
              <JobFinancialsTab
                jobTimer={jobTimer}
                tabNotes={tabNotes}
                setTabNotes={setTabNotes}
                totalRevenue={totalRevenue}
                totalCosts={totalCosts + totalBills}
                extractedFinancialData={extractedFinancialData}
                onUpdateInvoiceTotals={handleUpdateInvoiceTotals}
              />
            </TabsContent>

            <TabsContent value="conversations" className="mt-0 px-1 relative">
              <JobCustomerConversationsTab jobId={job.id} customerName={job.customer} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
