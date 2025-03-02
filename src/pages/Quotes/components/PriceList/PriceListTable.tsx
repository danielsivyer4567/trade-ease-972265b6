
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { PriceListItem } from "./types";

interface PriceListTableProps {
  priceListItems: PriceListItem[];
  isLoading: boolean;
  searchQuery: string;
  onAddItemToQuote: (item: PriceListItem) => void;
}

export const PriceListTable = ({ 
  priceListItems, 
  isLoading, 
  searchQuery, 
  onAddItemToQuote 
}: PriceListTableProps) => {
  const filteredPriceItems = priceListItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="border rounded-md overflow-hidden">
      {isLoading && priceListItems.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading price list items...</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left py-2 px-4 font-medium">Item</th>
              <th className="text-left py-2 px-4 font-medium">Category</th>
              <th className="text-right py-2 px-4 font-medium">Price</th>
              <th className="text-center py-2 px-4 font-medium w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPriceItems.length > 0 ? (
              filteredPriceItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      {item.name}
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary" className="font-normal">
                      {item.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">
                    <Button 
                      size="sm" 
                      onClick={() => onAddItemToQuote(item)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  {searchQuery ? 
                    "No items found matching your search criteria" : 
                    "No price list items found. Add some to get started."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
