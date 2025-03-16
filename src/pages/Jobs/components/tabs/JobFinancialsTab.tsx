
import { TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ExtractedDataDisplay } from "./financials/ExtractedDataDisplay";
import { SearchQuotes } from "./financials/SearchQuotes";
import { QuoteAmountInput } from "./financials/QuoteAmountInput";
import { FinancialSummary } from "./financials/FinancialSummary";
import { FinancialNotes } from "./financials/FinancialNotes";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for demonstration - in a real app this would come from your database
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
  extractedFinancialData?: any[];
}

export const JobFinancialsTab = ({ 
  jobTimer, 
  tabNotes, 
  setTabNotes, 
  totalRevenue,
  totalCosts,
  extractedFinancialData = []
}: JobFinancialsTabProps) => {
  const [quoteAmount, setQuoteAmount] = useState(0);
  const [hasAppliedExtractedData, setHasAppliedExtractedData] = useState(false);
  const [groupedFinancialData, setGroupedFinancialData] = useState<Record<string, any[]>>({});
  const isMobile = useIsMobile();
  
  const laborCost = (jobTimer / 3600) * 50; // Assuming $50/hour labor rate
  const totalCostsWithLabor = totalCosts + laborCost;
  const netProfitWithLabor = quoteAmount - totalCostsWithLabor;

  // Group extracted financial data by category
  useEffect(() => {
    if (extractedFinancialData.length > 0) {
      const grouped: Record<string, any[]> = {};
      
      extractedFinancialData.forEach(data => {
        const category = data.category || 'uncategorized';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(data);
      });
      
      setGroupedFinancialData(grouped);
    }
  }, [extractedFinancialData]);

  // Auto-apply the most recent extracted amount if we haven't applied one yet
  useEffect(() => {
    if (!hasAppliedExtractedData && extractedFinancialData.length > 0) {
      const mostRecentData = extractedFinancialData[extractedFinancialData.length - 1];
      setQuoteAmount(mostRecentData.amount);
      setHasAppliedExtractedData(true);
      
      setTabNotes({ 
        ...tabNotes, 
        financials: `${tabNotes.financials || ''}\n\nAutomatically applied extracted amount of $${mostRecentData.amount} from "${mostRecentData.source}" on ${new Date(mostRecentData.timestamp).toLocaleString()}`
      });
    }
  }, [extractedFinancialData, hasAppliedExtractedData, setTabNotes, tabNotes]);

  const applyExtractedAmount = (data: any) => {
    setQuoteAmount(data.amount);
    setTabNotes({ 
      ...tabNotes, 
      financials: `${tabNotes.financials || ''}\n\nApplied extracted amount of $${data.amount} from "${data.source}" on ${new Date(data.timestamp).toLocaleString()}`
    });
    toast.success(`Applied amount: $${data.amount}`);
  };

  // Calculate total extracted by category
  const calculateTotalByCategory = (category: string) => {
    if (!groupedFinancialData[category]) return 0;
    return groupedFinancialData[category].reduce((total, item) => total + item.amount, 0);
  };

  return (
    <TabsContent value="financials" className="space-y-4">
      <div className={`border rounded-lg p-4 ${isMobile ? 'overflow-x-hidden' : ''}`}>
        <div className={`space-y-8 ${isMobile ? 'w-full' : 'max-w-full'}`}>
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
