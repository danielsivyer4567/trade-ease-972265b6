
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Search, FileText, Upload, AlertCircle, Calendar, DollarSign, Building } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [hasAppliedExtractedData, setHasAppliedExtractedData] = useState(false);
  const [groupedFinancialData, setGroupedFinancialData] = useState<Record<string, any[]>>({});
  
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

  const filteredQuotes = mockCustomerQuotes.filter(quote => 
    quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="border rounded-lg p-4">
        <div className="space-y-4">
          {extractedFinancialData.length > 0 && (
            <Alert className="bg-blue-50 border-blue-200">
              <FileText className="h-4 w-4 text-blue-600" />
              <AlertTitle>Document Analysis Data Available</AlertTitle>
              <AlertDescription className="mt-2">
                {extractedFinancialData.length} financial data point(s) extracted from your documents
                
                <div className="mt-3 space-y-4">
                  {Object.keys(groupedFinancialData).map(category => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-medium capitalize flex items-center">
                        {category === 'invoice' && <FileText className="h-4 w-4 mr-1" />}
                        {category === 'quote' && <DollarSign className="h-4 w-4 mr-1" />}
                        {category === 'receipt' && <Receipt className="h-4 w-4 mr-1" />}
                        {category === 'bill' && <Building className="h-4 w-4 mr-1" />}
                        {category} Documents 
                        <span className="text-xs ml-2 bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Total: ${calculateTotalByCategory(category).toFixed(2)}
                        </span>
                      </h4>
                      
                      {groupedFinancialData[category].map((data, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-2 bg-white rounded border border-blue-100 hover:bg-blue-50 cursor-pointer"
                          onClick={() => applyExtractedAmount(data)}
                        >
                          <div className="text-sm space-y-1">
                            <div className="font-medium">${data.amount.toFixed(2)}</div>
                            <div className="text-xs text-gray-500 flex items-center space-x-2">
                              {data.vendor && (
                                <span className="flex items-center">
                                  <Building className="h-3 w-3 mr-1" />
                                  {data.vendor}
                                </span>
                              )}
                              {data.date && (
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {data.date}
                                </span>
                              )}
                              <span>
                                {data.source && `from "${data.source}"`}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {data.status && (
                              <span className={`text-xs px-2 py-1 rounded mr-2 ${
                                data.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {data.status === 'approved' ? 'Approved' : 'Draft'}
                              </span>
                            )}
                            <button className="text-xs text-blue-600 hover:text-blue-800">
                              Apply
                            </button>
                          </div>
                        </div>
                      ))}
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
