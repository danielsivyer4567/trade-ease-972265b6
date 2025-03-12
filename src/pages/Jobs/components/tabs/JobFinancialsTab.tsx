
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Search, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
}

export const JobFinancialsTab = ({ 
  jobTimer, 
  tabNotes, 
  setTabNotes, 
  totalRevenue,
  totalCosts 
}: JobFinancialsTabProps) => {
  const [quoteAmount, setQuoteAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [extractedFinancialData, setExtractedFinancialData] = useState<any[]>([]);
  const [hasAppliedExtractedData, setHasAppliedExtractedData] = useState(false);
  
  const laborCost = (jobTimer / 3600) * 50; // Assuming $50/hour labor rate
  const totalCostsWithLabor = totalCosts + laborCost;
  const netProfitWithLabor = quoteAmount - totalCostsWithLabor;

  // Fetch any extracted financial data from the workflow
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('vision-financial-data') || '[]');
    if (storedData.length > 0) {
      setExtractedFinancialData(storedData);
      
      // Auto-apply the most recent extracted amount if we haven't applied one yet
      if (!hasAppliedExtractedData && storedData.length > 0) {
        const mostRecentData = storedData[storedData.length - 1];
        setQuoteAmount(mostRecentData.amount);
        setHasAppliedExtractedData(true);
      }
    }
  }, [hasAppliedExtractedData]);

  const filteredQuotes = mockCustomerQuotes.filter(quote => 
    quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const applyExtractedAmount = (data) => {
    setQuoteAmount(data.amount);
    setTabNotes({ 
      ...tabNotes, 
      financials: `${tabNotes.financials || ''}\n\nApplied extracted amount of $${data.amount} from vision analysis on ${new Date(data.timestamp).toLocaleString()}`
    });
  };

  return (
    <TabsContent value="financials" className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="space-y-4">
          {extractedFinancialData.length > 0 && (
            <Alert className="bg-blue-50 border-blue-200">
              <FileText className="h-4 w-4 text-blue-600" />
              <AlertTitle>Vision Analysis Data Available</AlertTitle>
              <AlertDescription className="mt-2">
                {extractedFinancialData.length} financial data point(s) extracted from your documents
                
                <div className="mt-2 space-y-2">
                  {extractedFinancialData.map((data, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center p-2 bg-white rounded border border-blue-100 hover:bg-blue-50 cursor-pointer"
                      onClick={() => applyExtractedAmount(data)}
                    >
                      <div className="text-sm">
                        <span className="font-medium">${data.amount}</span>
                        <span className="text-gray-500 ml-2 text-xs">
                          {new Date(data.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <button className="text-xs text-blue-600 hover:text-blue-800">
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="search">Search Customer Quotes</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer name or quote number..."
                className="pl-10"
              />
            </div>
            {searchTerm && (
              <div className="mt-2 border rounded-lg divide-y">
                {filteredQuotes.map(quote => (
                  <div 
                    key={quote.id}
                    className="p-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                    onClick={() => setQuoteAmount(quote.amount)}
                  >
                    <div>
                      <span className="font-medium">{quote.customerName}</span>
                      <span className="text-sm text-gray-500 ml-2">({quote.id})</span>
                    </div>
                    <span className="font-medium text-blue-600">${quote.amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="quote">Quote Amount ($)</Label>
            <Input
              id="quote"
              type="number"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(Number(e.target.value))}
              placeholder="Enter quote amount"
              className="mt-1"
            />
          </div>

          <h3 className="font-medium mb-4">Financial Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Quote Amount:</span>
                <span className="font-medium text-blue-600">${quoteAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Costs:</span>
                <span className="font-medium text-red-600">${totalCostsWithLabor.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Net Profit:</span>
                <span className={`font-medium ${netProfitWithLabor >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netProfitWithLabor.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Labor Hours:</span>
                <span className="font-medium">{jobTimer ? Math.floor(jobTimer / 3600) : 0} hrs</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Labor Cost:</span>
                <span className="font-medium">${laborCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Materials Cost:</span>
                <span className="font-medium">${totalCosts.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Financial Notes</h4>
            <Textarea
              placeholder="Add financial notes here..."
              value={tabNotes.financials || ""}
              onChange={(e) => setTabNotes({ ...tabNotes, financials: e.target.value })}
            />
          </div>
        </div>
      </div>
    </TabsContent>
  );
};
