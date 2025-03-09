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
  return <div className="w-full flex items-center gap-1 bg-slate-400 hover:bg-slate-300 py-[10px]">
      <h3 className="text-lg font-medium">Filter Leads</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="px-[27px] bg-slate-400">
          <Label htmlFor="postcode">Postcode</Label>
          <Input type="text" id="postcode" placeholder="Enter postcode" value={filters.postcode} onChange={e => onFilterChange("postcode", e.target.value)} />
        </div>
        <div className="bg-slate-400">
          <Label htmlFor="minSize">Min. Size (sqm)</Label>
          <Input type="number" id="minSize" placeholder="Enter minimum size" value={filters.minSize} onChange={e => onFilterChange("minSize", e.target.value)} />
        </div>
        <div className="bg-slate-400">
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
      
      <div className="flex items-center gap-4 rounded-lg bg-slate-300">
        <Label htmlFor="leadType" className="rounded-lg bg-slate-400 px-[27px] py-[9px] mx-[3px]">Lead Type</Label>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => onFilterChange("leadType", "available")} className="bg-slate-500 hover:bg-slate-400 px-[11px] text-center mx-[3px]">
            Available
          </Button>
          <Button variant="outline" size="sm" onClick={() => onFilterChange("leadType", "purchased")} className="px-[7px] bg-slate-500 hover:bg-slate-400 mx-[15px]">
            Purchased
          </Button>
        </div>
      </div>
      
      <div className="bg-slate-300">
        <h4 className="text-md font-medium text-gray-950">Saved Filters</h4>
        <div className="flex gap-2">
          {savedFilters.map((filter, index) => <Button key={filter.name} variant={filter.active ? "default" : "outline"} size="sm" onClick={() => onSavedFilterToggle(index)} className="rounded-sm bg-slate-500 hover:bg-slate-400">
              {filter.name}
            </Button>)}
        </div>
      </div>
    </div>;
};