
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PurchaseOrderActionsProps {
  onSearch: (value: string) => void;
}

export function PurchaseOrderActions({ onSearch }: PurchaseOrderActionsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Button 
          className="bg-[#00A3BE] hover:bg-[#008CA3] flex items-center gap-2"
          onClick={() => navigate("/purchase-orders/create")}
        >
          <Plus size={16} />
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
