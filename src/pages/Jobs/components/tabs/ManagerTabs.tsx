
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, Calculator, ScrollText, Wallet } from "lucide-react";
import { JobBillsTab } from "./JobBillsTab";
import { JobCostsTab } from "./JobCostsTab";
import { JobInvoicesTab } from "./JobInvoicesTab";
import { JobFinancialsTab } from "./JobFinancialsTab";
import { useIsMobile } from "@/hooks/use-mobile";

interface ManagerTabsProps {
  jobTimer: number;
  tabNotes: Record<string, string>;
  setTabNotes: (notes: Record<string, string>) => void;
  totalRevenue: number;
  totalCosts: number;
  totalBills: number;
  extractedFinancialData?: any[];
  onUpdateBillsTotals: (amount: number) => void;
  onUpdateCostsTotals: (amount: number) => void;
  onUpdateInvoiceTotals: (amount: number) => void;
}

export const ManagerTabs = ({
  jobTimer,
  tabNotes,
  setTabNotes,
  totalRevenue,
  totalCosts,
  totalBills,
  extractedFinancialData = [],
  onUpdateBillsTotals,
  onUpdateCostsTotals,
  onUpdateInvoiceTotals
}: ManagerTabsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <>
      <TabsTrigger value="bills" className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300">
        {!isMobile && <Receipt className="w-4 h-4 mr-2" />}
        Bills
      </TabsTrigger>
      <TabsTrigger value="costs" className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300">
        {!isMobile && <Calculator className="w-4 h-4 mr-2" />}
        Costs
      </TabsTrigger>
      <TabsTrigger value="invoices" className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300">
        {!isMobile && <ScrollText className="w-4 h-4 mr-2" />}
        Invoices
      </TabsTrigger>
      <TabsTrigger value="financials" className="min-w-[80px] sm:min-w-[100px] whitespace-nowrap flex-shrink-0 bg-slate-400 hover:bg-slate-300">
        {!isMobile && <Wallet className="w-4 h-4 mr-2" />}
        Financials
      </TabsTrigger>

      <TabsContent value="bills" className="mt-4 px-1">
        <JobBillsTab
          tabNotes={tabNotes}
          setTabNotes={setTabNotes}
          onUpdateTotals={onUpdateBillsTotals}
        />
      </TabsContent>
      
      <TabsContent value="costs" className="mt-4 px-1">
        <JobCostsTab
          tabNotes={tabNotes}
          setTabNotes={setTabNotes}
          onUpdateTotals={onUpdateCostsTotals}
        />
      </TabsContent>
      
      <TabsContent value="invoices" className="mt-4 px-1">
        <JobInvoicesTab
          tabNotes={tabNotes}
          setTabNotes={setTabNotes}
          onUpdateTotals={onUpdateInvoiceTotals}
        />
      </TabsContent>
      
      <TabsContent value="financials" className="mt-4 px-1">
        <JobFinancialsTab
          jobTimer={jobTimer}
          tabNotes={tabNotes}
          setTabNotes={setTabNotes}
          totalRevenue={totalRevenue}
          totalCosts={totalCosts + totalBills}
          extractedFinancialData={extractedFinancialData}
        />
      </TabsContent>
    </>
  );
};
