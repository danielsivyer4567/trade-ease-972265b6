import { TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ExtractedDataDisplay } from "./financials/ExtractedDataDisplay";
import { SearchQuotes } from "./financials/SearchQuotes";
import { QuoteAmountInput } from "./financials/QuoteAmountInput";
import { FinancialSummary } from "./financials/FinancialSummary";
import { FinancialNotes } from "./financials/FinancialNotes";
import { useIsMobile } from "@/hooks/use-mobile";
import { FinancialData } from "../../hooks/financial-data/types";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Briefcase, Box, FilePlus, Receipt, AlertTriangle } from "lucide-react";

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
  const [quoteAmount, setQuoteAmount] = useState(0);
  const [hasAppliedExtractedData, setHasAppliedExtractedData] = useState(false);
  const [groupedFinancialData, setGroupedFinancialData] = useState<Record<string, any[]>>({});
  const isMobile = useIsMobile();
  
  const laborCost = (jobTimer / 3600) * 50; // Assuming $50/hour labor rate
  const totalCostsWithLabor = totalCosts + laborCost;
  const netProfitWithLabor = quoteAmount - totalCostsWithLabor;

  const [financialTotals, setFinancialTotals] = useState({
    invoiced: 0,
    variations: 0,
    subcontractors: 0,
    materials: 0,
    unexpected: 0
  });

  useEffect(() => {
    if (extractedFinancialData.length > 0) {
      const grouped: Record<string, any[]> = {};
      const totals = {
        invoiced: 0,
        variations: 0,
        subcontractors: 0,
        materials: 0,
        unexpected: 0
      };
      
      extractedFinancialData.forEach(data => {
        const category = data.category || 'uncategorized';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(data);

        switch(category.toLowerCase()) {
          case 'invoice':
            totals.invoiced += data.amount || 0;
            break;
          case 'variation':
            totals.variations += data.amount || 0;
            break;
          case 'subcontractor':
            totals.subcontractors += data.amount || 0;
            break;
          case 'material':
            totals.materials += data.amount || 0;
            break;
          case 'unexpected':
            totals.unexpected += data.amount || 0;
            break;
          default:
            break;
        }
      });
      
      setGroupedFinancialData(grouped);
      setFinancialTotals(totals);
    }
  }, [extractedFinancialData]);

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

  const calculateTotalByCategory = (category: string) => {
    if (!groupedFinancialData[category]) return 0;
    return groupedFinancialData[category].reduce((total, item) => total + item.amount, 0);
  };

  return (
    <TabsContent value="financials" className="space-y-4">
      <div className={`border rounded-lg p-4 ${isMobile ? 'overflow-x-hidden' : ''}`}>
        <div className={`space-y-8 ${isMobile ? 'w-full' : 'max-w-full'}`}>
          <div className="mb-6">
            <SectionHeader 
              title="Financial Overview" 
              description="Summary of all financial categories for this job" 
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Receipt className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-medium text-blue-800">Invoiced</h3>
                    </div>
                    <span className="text-lg font-bold text-blue-700">${financialTotals.invoiced.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FilePlus className="h-5 w-5 text-purple-600 mr-2" />
                      <h3 className="font-medium text-purple-800">Variations</h3>
                    </div>
                    <span className="text-lg font-bold text-purple-700">${financialTotals.variations.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-amber-600 mr-2" />
                      <h3 className="font-medium text-amber-800">Subcontractors</h3>
                    </div>
                    <span className="text-lg font-bold text-amber-700">${financialTotals.subcontractors.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Box className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="font-medium text-green-800">Materials</h3>
                    </div>
                    <span className="text-lg font-bold text-green-700">${financialTotals.materials.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      <h3 className="font-medium text-red-800">Unexpected</h3>
                    </div>
                    <span className="text-lg font-bold text-red-700">${financialTotals.unexpected.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

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
