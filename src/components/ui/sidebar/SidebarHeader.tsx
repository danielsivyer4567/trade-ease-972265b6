import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, MenuIcon, ChevronDown, Search, Plus } from 'lucide-react';
import { useSidebarTheme } from './theme/SidebarThemeContext';

interface SidebarHeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

export function SidebarHeader({ isExpanded, onToggle, className }: SidebarHeaderProps) {
  const { theme } = useSidebarTheme();
  const [currentBusiness, setCurrentBusiness] = useState("Affordable Fencing");
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
  
  // Mock business list data - would come from API/context in real implementation
  const businesses = [
    "Affordable Fencing",
    "Second Business",
    "Third Business"
  ];
  
  const toggleBusinessDropdown = () => {
    setIsBusinessDropdownOpen(!isBusinessDropdownOpen);
  };
  
  const selectBusiness = (business: string) => {
    setCurrentBusiness(business);
    setIsBusinessDropdownOpen(false);
  };
  
  return (
    <div className={cn(
      "flex flex-col",
      className
    )}>
      {/* Header with toggle */}
      <div className={cn(
        // sidebarHeaderVariants({ theme }), // This was causing an error after ThemeSwitcher removal, so commenting out
        "flex items-center",
        "bg-gradient-to-r from-[#1e2a3b] to-[#23375d]", 
        "h-12 px-3",
        className
      )}>
        <div className="flex flex-1 items-center justify-center gap-2">
          {/* Always show logo */}
          
          {/* Always show text */}
          <span className="font-bold text-lg text-white whitespace-nowrap">TradeEase</span>
          <img src="/lovable-uploads/147b0371-94bb-403e-a449-f6fc081c4d6c.png" alt="TradeEase Logo" className="h-5 w-auto ml-1" />
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-white/10 transition-colors"
        >
          {isExpanded ? (
            <ChevronLeft className="h-5 w-5 text-white" />
          ) : (
            <MenuIcon className="h-5 w-5 text-white" />
          )}
        </button>
      </div>

      {/* Business Selector - Only show when sidebar is expanded */}
      {isExpanded && (
        <div className="px-2 py-2">
          <div className="relative">
            <div 
              className="flex items-center justify-between bg-white text-gray-800 px-2 py-1.5 rounded cursor-pointer"
              onClick={toggleBusinessDropdown}
            >
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V18" stroke="currentColor" strokeWidth="2"/>
                  <path d="M6 12H18" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span className="text-xs font-medium truncate">{currentBusiness}</span>
              </div>
              <ChevronDown className="h-3 w-3 text-gray-500 ml-1" />
            </div>
            
            {/* Dropdown */}
            {isBusinessDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded shadow-lg z-10">
                {businesses.map((business, index) => (
                  <div 
                    key={index} 
                    className="px-2 py-1.5 hover:bg-gray-100 cursor-pointer text-xs"
                    onClick={() => selectBusiness(business)}
                  >
                    {business}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Search Bar */}
          <div className="mt-2 flex items-center gap-1">
            <div className="flex-1 relative flex items-center bg-gray-700 rounded px-2 py-1">
              <Search className="h-3 w-3 text-gray-400 absolute left-2" />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-transparent border-none outline-none text-white pl-5 text-xs placeholder-gray-400"
              />
              <span className="text-[10px] text-gray-400 ml-1">ctrl K</span>
            </div>
            <button className="p-1 bg-green-500 text-white rounded">
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
