
import { FileText, Calendar, DollarSign, Building, Receipt } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExtractedDataDisplayProps {
  extractedFinancialData: any[];
  groupedFinancialData: Record<string, any[]>;
  calculateTotalByCategory: (category: string) => number;
  applyExtractedAmount: (data: any) => void;
}

export const ExtractedDataDisplay = ({
  extractedFinancialData,
  groupedFinancialData,
  calculateTotalByCategory,
  applyExtractedAmount
}: ExtractedDataDisplayProps) => {
  const isMobile = useIsMobile();
  
  if (extractedFinancialData.length === 0) {
    return null;
  }

  return (
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
              
              <div className={`space-y-2 ${isMobile ? 'w-full' : ''}`}>
                {groupedFinancialData[category].map((data, index) => (
                  <div 
                    key={index} 
                    className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-start sm:items-center p-2 bg-white rounded border border-blue-100 hover:bg-blue-50`}
                  >
                    <div className="text-sm space-y-1 w-full">
                      <div className="font-medium">${data.amount.toFixed(2)}</div>
                      <div className="text-xs text-gray-500 flex flex-wrap gap-2">
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
                        {data.source && (
                          <span className="flex items-center truncate max-w-full sm:max-w-[180px]">
                            <FileText className="h-3 w-3 mr-1" />
                            "{data.source}"
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`flex items-center ${isMobile ? 'w-full justify-between mt-2' : 'ml-2'}`}>
                      {data.status && (
                        <span className={`text-xs px-2 py-1 rounded mr-2 ${
                          data.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {data.status === 'approved' ? 'Approved' : 'Draft'}
                        </span>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => applyExtractedAmount(data)}
                      >
                        Apply Amount
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
};
