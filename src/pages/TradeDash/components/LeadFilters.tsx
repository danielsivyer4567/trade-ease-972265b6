import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TRADE_TYPES } from "../constants";
import { Filter, Search, X, SlidersHorizontal, Tag } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPostcodes, setSelectedPostcodes] = useState<string[]>([]);
  const [includeResold, setIncludeResold] = useState(false);
  const [includeContractorLeads, setIncludeContractorLeads] = useState(false);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // We could also add a debounced search function here
  };
  const handlePostcodeKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      const postcode = e.currentTarget.value.trim();
      if (postcode && !selectedPostcodes.includes(postcode)) {
        setSelectedPostcodes([...selectedPostcodes, postcode]);
        e.currentTarget.value = '';
      }
    }
  };
  const removePostcode = (postcode: string) => {
    setSelectedPostcodes(selectedPostcodes.filter(p => p !== postcode));
  };
  return <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input placeholder="Search leads by title, description or location..." className="pl-10" value={searchQuery} onChange={handleSearchChange} />
        </div>
        
        <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          {showAdvancedFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {showAdvancedFilters && <div className="space-y-4 bg-slate-100 p-4 rounded-md">
          <div className="flex flex-wrap gap-2">
            {savedFilters.map((filter, index) => <Button key={filter.name} variant={filter.active ? "default" : "outline"} size="sm" onClick={() => onSavedFilterToggle(index)} className="text-xs bg-slate-400 hover:bg-slate-300">
                {filter.name}
              </Button>)}
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All Leads</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="size">Size</TabsTrigger>
              <TabsTrigger value="source">Lead Source</TabsTrigger>
            </TabsList>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postcode-filter">Postcodes</Label>
                  <Input id="postcode-filter" placeholder="Enter postcodes and press Enter" onKeyPress={handlePostcodeKeyPress} />
                  {selectedPostcodes.length > 0 && <div className="flex flex-wrap gap-2 mt-2">
                      {selectedPostcodes.map(postcode => <div key={postcode} className="flex items-center bg-slate-200 px-2 py-1 rounded-md text-xs">
                          {postcode}
                          <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removePostcode(postcode)} />
                        </div>)}
                    </div>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget-filter">Max Budget</Label>
                  <Input id="budget-filter" type="number" placeholder="Enter maximum budget" value={filters.maxBudget} onChange={e => onFilterChange('maxBudget', e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size-filter">Minimum Size (m²)</Label>
                  <Input id="size-filter" type="number" placeholder="Enter minimum size" value={filters.minSize} onChange={e => onFilterChange('minSize', e.target.value)} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lead-type">Lead Type</Label>
                  <Select value={filters.leadType} onValueChange={value => onFilterChange('leadType', value)}>
                    <SelectTrigger id="lead-type">
                      <SelectValue placeholder="Select lead type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trade-type">Trade Category</Label>
                  <Select value={filters.tradeType} onValueChange={value => onFilterChange('tradeType', value)}>
                    <SelectTrigger id="trade-type">
                      <SelectValue placeholder="Select trade type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRADE_TYPES.map(trade => <SelectItem key={trade} value={trade}>{trade}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-2 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-resold" checked={includeResold} onCheckedChange={checked => setIncludeResold(!!checked)} />
                  <label htmlFor="include-resold" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Include resold leads
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="contractor-leads" checked={includeContractorLeads} onCheckedChange={checked => setIncludeContractorLeads(!!checked)} />
                  <label htmlFor="contractor-leads" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Include leads from other contractors
                  </label>
                </div>
              </div>
            </div>
          </Tabs>
          
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <Button variant="outline" size="sm" onClick={() => {
          setSearchQuery("");
          setSelectedPostcodes([]);
          setIncludeResold(false);
          setIncludeContractorLeads(false);
        }}>
              Clear All
            </Button>
            <Button size="sm">Apply Filters</Button>
          </div>
        </div>}
    </div>;
};