
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PurchaseOrderActionsProps {
  onSearch: (value: string) => void;
}

export function PurchaseOrderActions({ onSearch }: PurchaseOrderActionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button className="bg-[#00A3BE] hover:bg-[#008CA3]">
          New Purchase Order
        </Button>
        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-9"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
