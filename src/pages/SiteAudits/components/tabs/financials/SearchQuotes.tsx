
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface QuoteItem {
  id: string;
  customerName: string;
  amount: number;
}

interface SearchQuotesProps {
  onSelectQuote: (amount: number) => void;
  customerQuotes: QuoteItem[];
}

export const SearchQuotes = ({ onSelectQuote, customerQuotes }: SearchQuotesProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuotes = customerQuotes.filter(quote => 
    quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
              onClick={() => onSelectQuote(quote.amount)}
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
  );
};
