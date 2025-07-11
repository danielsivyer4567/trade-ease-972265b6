
import { TabsContent } from "@/components/ui/tabs";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Search, FileText, FilePlus, FileCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration - in a real app this would come from your database
const mockCustomerQuotes = [
  { id: "qt3455", customerName: "Jess Williams", amount: 2500, type: "quote", status: "pending" },
  { id: "qt3344", customerName: "Jess Williams", amount: 1800, type: "quote", status: "approved" },
  { id: "inv1001", customerName: "Jess Williams", amount: 2500, type: "invoice", status: "sent" },
  { id: "var202", customerName: "Jess Williams", amount: 350, type: "variation", status: "pending" },
  { id: "qt3456", customerName: "John Smith", amount: 3200, type: "quote", status: "pending" },
  { id: "inv1002", customerName: "John Smith", amount: 3200, type: "invoice", status: "paid" },
  { id: "qt3457", customerName: "Sarah Johnson", amount: 4100, type: "quote", status: "rejected" }
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
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [groupedDocuments, setGroupedDocuments] = useState<Record<string, typeof mockCustomerQuotes>>({});

  useEffect(() => {
    // Group documents by type for easier display
    const grouped = mockCustomerQuotes.reduce((acc, doc) => {
      const key = doc.type;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(doc);
      return acc;
    }, {} as Record<string, typeof mockCustomerQuotes>);
    
    setGroupedDocuments(grouped);
  }, []);

  const filteredQuotes = mockCustomerQuotes.filter(quote => {
    const matchesSearch = 
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      activeFilter === "all" || 
      quote.type === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "approved": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "rejected": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "sent": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "paid": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getIconForDocumentType = (type: string) => {
    switch (type) {
      case "quote": return <FileText className="w-4 h-4 mr-1" />;
      case "invoice": return <FileCheck className="w-4 h-4 mr-1" />;
      case "variation": return <FilePlus className="w-4 h-4 mr-1" />;
      default: return <FileText className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <TabsContent value="invoices" className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="space-y-4">
          {/* Document Type Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge 
              variant="outline" 
              className={`cursor-pointer ${activeFilter === 'all' ? 'bg-blue-100' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </Badge>
            <Badge 
              variant="outline" 
              className={`cursor-pointer ${activeFilter === 'quote' ? 'bg-blue-100' : ''}`}
              onClick={() => setActiveFilter('quote')}
            >
              <FileText className="w-4 h-4 mr-1" /> Quotes
            </Badge>
            <Badge 
              variant="outline" 
              className={`cursor-pointer ${activeFilter === 'invoice' ? 'bg-blue-100' : ''}`}
              onClick={() => setActiveFilter('invoice')}
            >
              <FileCheck className="w-4 h-4 mr-1" /> Invoices
            </Badge>
            <Badge 
              variant="outline" 
              className={`cursor-pointer ${activeFilter === 'variation' ? 'bg-blue-100' : ''}`}
              onClick={() => setActiveFilter('variation')}
            >
              <FilePlus className="w-4 h-4 mr-1" /> Variations
            </Badge>
          </div>

          {/* Automatically displayed documents */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-2">Customer Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map(doc => (
                  <Card 
                    key={doc.id} 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${selectedQuoteId === doc.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => handleQuoteSelect(doc)}
                  >
                    <CardContent className="p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        {getIconForDocumentType(doc.type)}
                        <div>
                          <p className="font-medium">{doc.id}</p>
                          <p className="text-sm text-gray-500">{doc.customerName}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-medium">${doc.amount}</span>
                        <Badge className={getStatusBadgeColor(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 col-span-2 text-center py-4">No documents found matching your criteria</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="search">Search Documents</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer name or document number..."
                className="pl-10"
              />
            </div>
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
                Selected Document: {selectedQuoteId}
              </p>
            )}
          </div>

          <div>
            <Label>Upload Documents</Label>
            <FileUpload 
              onFileUpload={handleFileUpload} 
              label="Upload quotes, invoices, or variations" 
              allowGcpVision={true}
              onTextExtracted={handleTextExtracted}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              className="w-full min-h-[100px]"
              placeholder="Add notes about this document..."
              value={tabNotes.invoices || ""}
              onChange={(e) => setTabNotes({ ...tabNotes, invoices: e.target.value })}
            />
          </div>

          <ImagesGrid images={uploadedFiles} title="Uploaded Documents" />
        </div>
      </div>
    </TabsContent>
  );
};
