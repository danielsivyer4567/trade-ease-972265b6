
import { TabsContent } from "@/components/ui/tabs";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Mock data for demonstration - in a real app this would come from your database
const mockCustomerQuotes = [
  { id: "qt3455", customerName: "Jess Williams", amount: 2500 },
  { id: "qt3344", customerName: "Jess Williams", amount: 1800 },
  { id: "qt3456", customerName: "John Smith", amount: 3200 },
  { id: "qt3457", customerName: "Sarah Johnson", amount: 4100 }
];

interface JobInvoicesTabProps {
  tabNotes: Record<string, string>;
  setTabNotes: (notes: Record<string, string>) => void;
  onUpdateTotals: (amount: number) => void;
}

export const JobInvoicesTab = ({ tabNotes, setTabNotes, onUpdateTotals }: JobInvoicesTabProps) => {
  const [amount, setAmount] = useState<string>("");
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredQuotes = mockCustomerQuotes.filter(quote => 
    quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuoteSelect = (quote: typeof mockCustomerQuotes[0]) => {
    setSelectedQuoteId(quote.id);
    setAmount(quote.amount.toString());
    setSearchTerm("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );

    const imageUrls = newFiles
      .filter(file => file.type.startsWith('image/'))
      .map(file => URL.createObjectURL(file));

    setUploadedFiles(prev => [...prev, ...imageUrls]);

    if (amount) {
      onUpdateTotals(parseFloat(amount));
    }

    toast({
      title: "Files uploaded successfully",
      description: `${newFiles.length} files have been uploaded.`
    });
  };
  
  const handleTextExtracted = (text: string, filename: string) => {
    // Automatically update notes with the extracted text
    setTabNotes({ 
      ...tabNotes, 
      invoices: tabNotes.invoices ? 
        `${tabNotes.invoices}\n\n--- Extracted from ${filename} ---\n${text}` : 
        `--- Extracted from ${filename} ---\n${text}` 
    });
    
    // Try to extract amount information from the text
    const amountMatch = text.match(/\$?\s*(\d{1,3}(,\d{3})*(\.\d{2})?)/);
    if (amountMatch && amountMatch[1]) {
      const cleanAmount = amountMatch[1].replace(/,/g, '');
      setAmount(cleanAmount);
      onUpdateTotals(parseFloat(cleanAmount));
      toast({
        title: "Amount detected",
        description: `Extracted amount: $${cleanAmount}`
      });
    }
    
    // Try to extract quote ID if present
    const quoteMatch = text.match(/quote[:\s]*(#*\w+[-]?\d+)/i);
    if (quoteMatch && quoteMatch[1]) {
      const quoteId = quoteMatch[1];
      // Check if the extracted quote ID matches any in our mock data
      const matchedQuote = mockCustomerQuotes.find(q => 
        q.id.toLowerCase().includes(quoteId.toLowerCase())
      );
      
      if (matchedQuote) {
        setSelectedQuoteId(matchedQuote.id);
        toast({
          title: "Quote ID detected",
          description: `Found matching quote: ${matchedQuote.id}`
        });
      }
    }
  };

  return (
    <TabsContent value="invoices" className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Select Quote</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search quotes by customer name or quote number..."
                className="pl-10"
              />
            </div>
            {searchTerm && (
              <div className="mt-2 border rounded-lg divide-y">
                {filteredQuotes.map(quote => (
                  <div 
                    key={quote.id}
                    className={`p-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center ${
                      selectedQuoteId === quote.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleQuoteSelect(quote)}
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
            <Label htmlFor="amount">Invoice Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter invoice amount"
              className="mt-1"
            />
            {selectedQuoteId && (
              <p className="text-sm text-gray-500 mt-1">
                Attached to Quote: {selectedQuoteId}
              </p>
            )}
          </div>

          <div>
            <Label>Upload Invoices</Label>
            <FileUpload 
              onFileUpload={handleFileUpload} 
              label="Upload invoices" 
              allowGcpVision={true}
              onTextExtracted={handleTextExtracted}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              className="w-full min-h-[100px]"
              placeholder="Add notes about this invoice..."
              value={tabNotes.invoices || ""}
              onChange={(e) => setTabNotes({ ...tabNotes, invoices: e.target.value })}
            />
          </div>

          <ImagesGrid images={uploadedFiles} title="Uploaded Invoices" />
        </div>
      </div>
    </TabsContent>
  );
};
