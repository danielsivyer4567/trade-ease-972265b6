
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceListSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const PriceListSearch = ({ searchQuery, setSearchQuery }: PriceListSearchProps) => {
  return (
    <div>
      <Label htmlFor="price-list-search">Search Price List</Label>
      <div className="relative mt-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input 
          id="price-list-search" 
          placeholder="Search by name or category..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};
