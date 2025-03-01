
import { useMemo } from "react";
import { 
  Check, 
  Clock, 
  AlertTriangle, 
  MoreHorizontal, 
  FileText, 
  Send, 
  Copy, 
  Download, 
  Trash2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Mock data for quotes
const MOCK_QUOTES = [
  {
    id: "Q-2024-001",
    customerName: "John Smith",
    description: "Bathroom Renovation",
    totalAmount: 4850,
    createdDate: "2024-04-10",
    expiryDate: "2024-05-10",
    status: "pending"
  },
  {
    id: "Q-2024-002",
    customerName: "Sarah Johnson",
    description: "Kitchen Remodel",
    totalAmount: 7200,
    createdDate: "2024-04-05",
    expiryDate: "2024-05-05",
    status: "accepted"
  },
  {
    id: "Q-2024-003",
    customerName: "Michael Williams",
    description: "Plumbing Repair",
    totalAmount: 650,
    createdDate: "2024-03-28",
    expiryDate: "2024-04-28",
    status: "expired"
  },
  {
    id: "Q-2024-004",
    customerName: "David Brown",
    description: "Electrical Wiring",
    totalAmount: 1250,
    createdDate: "2024-04-02",
    expiryDate: "2024-05-02",
    status: "pending"
  },
  {
    id: "Q-2024-005",
    customerName: "Emma Davis",
    description: "Roof Replacement",
    totalAmount: 8500,
    createdDate: "2024-03-25",
    expiryDate: "2024-04-25",
    status: "accepted"
  }
];

export function QuotesList({ status }: { status: "all" | "pending" | "accepted" | "expired" }) {
  const { toast } = useToast();

  const filteredQuotes = useMemo(() => {
    if (status === "all") return MOCK_QUOTES;
    return MOCK_QUOTES.filter(quote => quote.status === status);
  }, [status]);

  const handleAction = (action: string, quoteId: string) => {
    toast({
      title: "Action Triggered",
      description: `${action} quote ${quoteId}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  if (filteredQuotes.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 mx-auto text-gray-300" />
        <h3 className="mt-4 text-lg font-medium">No quotes found</h3>
        <p className="mt-2 text-gray-500">There are no quotes matching the current filter.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">Quote #</th>
            <th className="text-left py-3 px-4 font-medium">Customer</th>
            <th className="text-left py-3 px-4 font-medium">Description</th>
            <th className="text-left py-3 px-4 font-medium">Amount</th>
            <th className="text-left py-3 px-4 font-medium">Created</th>
            <th className="text-left py-3 px-4 font-medium">Expires</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
            <th className="text-right py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuotes.map((quote) => (
            <tr key={quote.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{quote.id}</td>
              <td className="py-3 px-4">{quote.customerName}</td>
              <td className="py-3 px-4">{quote.description}</td>
              <td className="py-3 px-4">${quote.totalAmount.toLocaleString()}</td>
              <td className="py-3 px-4">{quote.createdDate}</td>
              <td className="py-3 px-4">{quote.expiryDate}</td>
              <td className="py-3 px-4">{getStatusBadge(quote.status)}</td>
              <td className="py-3 px-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleAction("View", quote.id)}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Quote
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction("Send", quote.id)}>
                      <Send className="mr-2 h-4 w-4" />
                      Send to Customer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction("Duplicate", quote.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction("Download", quote.id)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </DropdownMenuItem>
                    {quote.status === "pending" && (
                      <DropdownMenuItem onClick={() => handleAction("Convert", quote.id)}>
                        <Check className="mr-2 h-4 w-4" />
                        Convert to Job
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAction("Delete", quote.id)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
