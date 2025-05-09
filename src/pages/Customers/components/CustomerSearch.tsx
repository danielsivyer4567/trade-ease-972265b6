import React, { useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, User } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface CustomerSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCustomers: any[];
  onCustomerChange: (customerId: string) => void;
  showSearchResults: boolean;
  setShowSearchResults: (show: boolean) => void;
}

export const CustomerSearch = ({
  searchQuery,
  setSearchQuery,
  filteredCustomers,
  onCustomerChange,
  showSearchResults,
  setShowSearchResults
}: CustomerSearchProps) => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Close search results when clicking outside
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
  }, [setShowSearchResults]);
  
  const handleCustomerClick = (customerId: string) => {
    onCustomerChange(customerId);
    setShowSearchResults(false);
    navigate(`/customers/${customerId}`);
  };
  
  return (
    <div className="relative flex-1 min-w-0">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          placeholder={isMobile ? "Search..." : "Search customers by name or email..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowSearchResults(true)}
          className="pl-8 pr-2 h-9 w-full"
        />
      </div>
      
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
  );
};
