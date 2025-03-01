
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function QuoteSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search quotes by customer, number or description..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 w-full"
      />
    </div>
  );
}
