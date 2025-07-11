import React, { useState } from 'react';
import { ChevronDown, Search, Plus } from 'lucide-react';

// Mock data (replace with actual data fetching/context)
const businesses = [
  "Affordable Fencing",
  "Second Business",
  "Third Business"
];

export function SidebarCollapsibleHeader() {
  const [currentBusiness, setCurrentBusiness] = useState("Affordable Fencing");
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);

  const toggleBusinessDropdown = () => {
    setIsBusinessDropdownOpen(!isBusinessDropdownOpen);
  };

  const selectBusiness = (business: string) => {
    setCurrentBusiness(business);
    setIsBusinessDropdownOpen(false);
  };

  return (
    <div className="px-3 py-3 border-b border-white/10"> {/* Added border */} 
      <div className="relative">
        <div 
          className="flex items-center justify-between bg-white text-gray-800 px-3 py-2 rounded cursor-pointer"
          onClick={toggleBusinessDropdown}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6V18" stroke="currentColor" strokeWidth="2"/>
              <path d="M6 12H18" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="text-sm font-medium truncate">{currentBusiness}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 ml-2" />
        </div>
        
        {/* Dropdown */}
        {isBusinessDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded shadow-lg z-10">
            {businesses.map((business, index) => (
              <div 
                key={index} 
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => selectBusiness(business)}
              >
                {business}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Search Bar */}
      <div className="mt-3 relative">
        <div className="flex items-center bg-gray-700 rounded px-3 py-1.5 pr-16">
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-gray-400"
          />
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <span className="text-xs text-gray-400">ctrl K</span>
          <button className="p-0.5 bg-green-500 text-white rounded">
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
} 