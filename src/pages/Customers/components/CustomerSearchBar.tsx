import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface CustomerSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  filteredCustomers?: any[]; // Make this optional to maintain backward compatibility
}

export const CustomerSearchBar = ({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  filteredCustomers = []
}: CustomerSearchBarProps) => {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current && 
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleCustomerClick = (customerId: string) => {
    setShowSearchResults(false);
    navigate(`/customers/${customerId}`);
  };
  
  return (
    <div className="flex gap-4 flex-col sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input 
          ref={inputRef}
          placeholder="Search customers by name, email, or phone..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          onFocus={() => filteredCustomers.length > 0 && setShowSearchResults(true)}
          className="pl-10 bg-slate-200" 
        />
        
        {showSearchResults && filteredCustomers.length > 0 && (
          <div 
            ref={resultsRef}
            className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {filteredCustomers.map(customer => (
              <div
                key={customer.id}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => handleCustomerClick(customer.id)}
              >
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <div className="truncate">
                  <span className="font-medium">{customer.name}</span>
                  {customer.email && (
                    <span className="text-xs text-gray-500 ml-2">{customer.email}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
