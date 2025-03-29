
import { TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { FinancialData } from "../../hooks/financial-data/types";
import { ExtractedDataDisplay } from "./financials/ExtractedDataDisplay";
import { SearchQuotes } from "./financials/SearchQuotes";
import { QuoteAmountInput } from "./financials/QuoteAmountInput";
import { FinancialSummary } from "./financials/FinancialSummary";
import { FinancialNotes } from "./financials/FinancialNotes";
import { FinancialCategoriesOverview } from "./financials/FinancialCategoriesOverview";
import { useFinancialData } from "./financials/useFinancialData";

const mockCustomerQuotes = [
  { id: "qt3455", customerName: "Jess Williams", amount: 2500 },
  { id: "qt3344", customerName: "Jess Williams", amount: 1800 },
  { id: "qt3456", customerName: "John Smith", amount: 3200 },
  { id: "qt3457", customerName: "Sarah Johnson", amount: 4100 }
];

interface JobFinancialsTabProps {
  jobTimer: number;
  tabNotes: Record<string, string>;
  setTabNotes: (notes: Record<string, string>) => void;
  totalRevenue: number;
  totalCosts: number;
  extractedFinancialData?: FinancialData[];
}

export const JobFinancialsTab = ({ 
  jobTimer, 
  tabNotes, 
  setTabNotes, 
  totalRevenue,
  totalCosts,
  extractedFinancialData = []
}: JobFinancialsTabProps) => {
  const isMobile = useIsMobile();
  
  const {
    quoteAmount,
    setQuoteAmount,
    groupedFinancialData,
    financialTotals,
    calculateTotalByCategory,
    applyExtractedAmount
  } = useFinancialData(extractedFinancialData, tabNotes, setTabNotes);
  
  const laborCost = (jobTimer / 3600) * 50; // Assuming $50/hour labor rate
  const totalCostsWithLabor = totalCosts + laborCost;
  const netProfitWithLabor = quoteAmount - totalCostsWithLabor;

  return (
    <TabsContent value="financials" className="space-y-4">
      <div className={`border rounded-lg p-4 ${isMobile ? 'overflow-x-hidden' : ''}`}>
        <div className={`space-y-8 ${isMobile ? 'w-full' : 'max-w-full'}`}>
          <FinancialCategoriesOverview financialTotals={financialTotals} />

          <ExtractedDataDisplay 
            extractedFinancialData={extractedFinancialData}
            groupedFinancialData={groupedFinancialData}
            calculateTotalByCategory={calculateTotalByCategory}
            applyExtractedAmount={applyExtractedAmount}
          />

          <div className="mt-12 pt-4">
            <SearchQuotes 
              onSelectQuote={setQuoteAmount} 
              customerQuotes={mockCustomerQuotes} 
            />
          </div>

          <QuoteAmountInput 
            quoteAmount={quoteAmount} 
            setQuoteAmount={setQuoteAmount} 
          />

          <FinancialSummary 
            quoteAmount={quoteAmount}
            totalCostsWithLabor={totalCostsWithLabor}
            netProfitWithLabor={netProfitWithLabor}
            jobTimer={jobTimer}
            laborCost={laborCost}
            totalCosts={totalCosts}
          />

          <FinancialNotes 
            notes={tabNotes.financials || ""}
            setNotes={(notes) => setTabNotes({ ...tabNotes, financials: notes })}
          />
        </div>
      </div>
    </TabsContent>
  );
};
