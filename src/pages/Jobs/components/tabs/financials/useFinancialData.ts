
import { useState, useEffect } from "react";
import { FinancialData } from "../../../hooks/financial-data/types";
import { toast } from "sonner";

interface UseFinancialDataReturn {
  quoteAmount: number;
  setQuoteAmount: (amount: number) => void;
  hasAppliedExtractedData: boolean;
  groupedFinancialData: Record<string, any[]>;
  financialTotals: {
    invoiced: number;
    variations: number;
    subcontractors: number;
    materials: number;
    unexpected: number;
  };
  calculateTotalByCategory: (category: string) => number;
  applyExtractedAmount: (data: any) => void;
}

export const useFinancialData = (
  extractedFinancialData: FinancialData[] = [],
  tabNotes: Record<string, string>,
  setTabNotes: (notes: Record<string, string>) => void
): UseFinancialDataReturn => {
  const [quoteAmount, setQuoteAmount] = useState(0);
  const [hasAppliedExtractedData, setHasAppliedExtractedData] = useState(false);
  const [groupedFinancialData, setGroupedFinancialData] = useState<Record<string, any[]>>({});
  
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

  return {
    quoteAmount,
    setQuoteAmount,
    hasAppliedExtractedData,
    groupedFinancialData,
    financialTotals,
    calculateTotalByCategory,
    applyExtractedAmount
  };
};
