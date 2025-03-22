import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { SlidersHorizontal, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltersProps {
  filters: {
    postcode: string;
    minSize: string;
    maxBudget: string;
    leadType: string;
    tradeType: string;
  };
  savedFilters: Array<{
    name: string;
    active: boolean;
  }>;
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search leads by title, description or location..." 
              className="pl-9" 
              value={searchQuery} 
              onChange={handleSearchChange} 
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} 
            className={cn(
              "flex items-center gap-2",
              showAdvancedFilters && "bg-gray-100"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showAdvancedFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {showAdvancedFilters && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {savedFilters.map((filter, index) => (
                <Button 
                  key={filter.name} 
                  variant={filter.active ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => onSavedFilterToggle(index)}
                  className={cn(
                    "text-sm",
                    filter.active ? "bg-primary" : "bg-gray-50"
                  )}
                >
                  {filter.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  placeholder="Enter postcode"
                  value={filters.postcode}
                  onChange={(e) => onFilterChange("postcode", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minSize">Minimum Size (m²)</Label>
                <Input
                  id="minSize"
                  type="number"
                  placeholder="Enter minimum size"
                  value={filters.minSize}
                  onChange={(e) => onFilterChange("minSize", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="leadType">Lead Type</Label>
                <Select 
                  value={filters.leadType} 
                  onValueChange={(value) => onFilterChange("leadType", value)}
                >
                  <SelectTrigger id="leadType">
                    <SelectValue placeholder="Select lead type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Leads</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="purchased">Purchased</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tradeType">Trade Type</Label>
                <Select 
                  value={filters.tradeType} 
                  onValueChange={(value) => onFilterChange("tradeType", value)}
                >
                  <SelectTrigger id="tradeType">
                    <SelectValue placeholder="Select trade type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Trades">All Trades</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Carpentry">Carpentry</SelectItem>
                    <SelectItem value="Painting">Painting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};