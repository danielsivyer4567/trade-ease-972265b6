
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface CustomerSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

export const CustomerSearchBar = ({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter
}: CustomerSearchBarProps) => {
  return (
    <div className="flex gap-4 flex-col sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search customers by name, email, or phone..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          className="pl-10 bg-slate-200" 
        />
      </div>
      <div className="flex gap-2">
        <Button 
          variant={selectedFilter === "all" ? "default" : "outline"} 
          onClick={() => setSelectedFilter("all")} 
          className="bg-slate-400 hover:bg-slate-300"
        >
          All
        </Button>
        <Button 
          variant={selectedFilter === "active" ? "default" : "outline"} 
          onClick={() => setSelectedFilter("active")} 
          className="bg-slate-400 hover:bg-slate-300"
        >
          Active
        </Button>
        <Button 
          variant={selectedFilter === "inactive" ? "default" : "outline"} 
          onClick={() => setSelectedFilter("inactive")} 
          className="bg-slate-400 hover:bg-slate-300"
        >
          Inactive
        </Button>
      </div>
    </div>
  );
};
