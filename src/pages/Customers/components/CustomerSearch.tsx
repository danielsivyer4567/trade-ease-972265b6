
import React, { useState, useEffect } from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  return (
    <div className="flex-1 relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full"
        />
      </div>
      
      {showSearchResults && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((c) => (
              <div
                key={c.id}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                onClick={() => onCustomerChange(c.id)}
              >
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-500">{c.email}</div>
              </div>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">No customers found</div>
          )}
        </div>
      )}
    </div>
  );
};
