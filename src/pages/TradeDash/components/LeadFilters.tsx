import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TRADE_TYPES } from "../constants";
interface SavedFilter {
  name: string;
  active: boolean;
}
interface FiltersProps {
  filters: {
    postcode: string;
    minSize: string;
    maxBudget: string;
    leadType: string;
    tradeType: string;
  };
  savedFilters: SavedFilter[];
  onFilterChange: (field: string, value: string) => void;
  onSavedFilterToggle: (index: number) => void;
}
export const LeadFilters: React.FC<FiltersProps> = ({
  filters,
  savedFilters,
  onFilterChange,
  onSavedFilterToggle
}) => {
  return <div className="rounded-md p-4 space-y-4 bg-slate-200">
      <h3 className="text-lg font-medium">Filter Leads</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="postcode">Postcode</Label>
          <Input type="text" id="postcode" placeholder="Enter postcode" value={filters.postcode} onChange={e => onFilterChange("postcode", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="minSize">Min. Size (sqm)</Label>
          <Input type="number" id="minSize" placeholder="Enter minimum size" value={filters.minSize} onChange={e => onFilterChange("minSize", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="tradeType">Trade Type</Label>
          <Select value={filters.tradeType} onValueChange={value => onFilterChange("tradeType", value)}>
            <SelectTrigger id="tradeType">
              <SelectValue placeholder="Select a trade" />
            </SelectTrigger>
            <SelectContent>
              {TRADE_TYPES.map(trade => <SelectItem key={trade} value={trade}>{trade}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Label htmlFor="leadType">Lead Type</Label>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onFilterChange("leadType", "available")}>
            Available
          </Button>
          <Button variant="outline" size="sm" onClick={() => onFilterChange("leadType", "purchased")}>
            Purchased
          </Button>
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-medium">Saved Filters</h4>
        <div className="flex gap-2">
          {savedFilters.map((filter, index) => <Button key={filter.name} variant={filter.active ? "default" : "outline"} size="sm" onClick={() => onSavedFilterToggle(index)}>
              {filter.name}
            </Button>)}
        </div>
      </div>
    </div>;
};