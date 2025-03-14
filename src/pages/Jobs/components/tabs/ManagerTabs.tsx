
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Receipt, DollarSign, ScrollText, Calculator, Wallet } from "lucide-react";
import { JobBillsTab } from "./JobBillsTab";
import { JobCostsTab } from "./JobCostsTab";
import { JobInvoicesTab } from "./JobInvoicesTab";
import { JobFinancialsTab } from "./JobFinancialsTab";

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
  return (
    <>
      <TabsTrigger value="bills" className="min-w-[100px] whitespace-nowrap">
        <Receipt className="w-4 h-4 mr-2" />
        Bills
      </TabsTrigger>
      <TabsTrigger value="costs" className="min-w-[100px] whitespace-nowrap">
        <Calculator className="w-4 h-4 mr-2" />
        Costs
      </TabsTrigger>
      <TabsTrigger value="invoices" className="min-w-[100px] whitespace-nowrap">
        <ScrollText className="w-4 h-4 mr-2" />
        Invoices
      </TabsTrigger>
      <TabsTrigger value="financials" className="min-w-[100px] whitespace-nowrap">
        <Wallet className="w-4 h-4 mr-2" />
        Financials
      </TabsTrigger>

      <JobBillsTab
        tabNotes={tabNotes}
        setTabNotes={setTabNotes}
        onUpdateTotals={onUpdateBillsTotals}
      />
      <JobCostsTab
        tabNotes={tabNotes}
        setTabNotes={setTabNotes}
        onUpdateTotals={onUpdateCostsTotals}
      />
      <JobInvoicesTab
        tabNotes={tabNotes}
        setTabNotes={setTabNotes}
        onUpdateTotals={onUpdateInvoiceTotals}
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
  );
};
