import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, MenuIcon, ChevronDown, Search, Plus } from 'lucide-react';
import { ThemeSwitcher } from './theme/ThemeSwitcher';
import { sidebarHeaderVariants } from './theme/sidebarTheme';
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
        sidebarHeaderVariants({ theme }),
        "justify-between",
        "bg-gradient-to-r from-[#1e2a3b] to-[#23375d]", 
        className
      )}>
        <div className="flex items-center gap-2">
          {/* Always show logo */}
          <svg width="30" height="30" viewBox="0 0 146 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.3 24.3691C19.9412 24.3691 24.5143 19.8285 24.5143 14.2274C24.5143 8.6263 19.9412 4.08571 14.3 4.08571C8.6588 4.08571 4.08571 8.6263 4.08571 14.2274C4.08571 19.8285 8.6588 24.3691 14.3 24.3691Z" fill="white" />
            <path d="M10.7058 26.5042C9.63588 26.5042 8.98377 27.6728 9.55111 28.5734L13.1453 34.2791C13.6788 35.126 14.9212 35.126 15.4547 34.2791L19.0489 28.5734C19.6162 27.6728 18.9641 26.5042 17.8942 26.5042H10.7058Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M17.8942 26.5146C18.5781 26.5146 19.0913 26.9928 19.2244 27.5735C19.2995 27.9012 19.2536 28.2616 19.0489 28.587L15.4547 34.3012C14.9212 35.1493 13.6788 35.1493 13.1454 34.3012L9.55112 28.587C9.34643 28.2616 9.30048 27.9012 9.37561 27.5735C9.50871 26.9928 10.0219 26.5146 10.7058 26.5146H17.8942ZM5.75004 25.6186C2.25964 23.0258 0 18.8851 0 14.2195C0 6.3663 6.40233 0 14.3 0C22.1977 0 28.6 6.3663 28.6 14.2195C28.6 18.885 26.3404 23.0258 22.85 25.6186C23.5686 27.1767 23.5618 29.0737 22.5128 30.7414L18.9186 36.4555C16.7847 39.8482 11.8153 39.8481 9.6814 36.4555L6.08716 30.7414C5.0382 29.0737 5.03139 27.1767 5.75004 25.6186ZM8.80562 22.7832C9.3999 23.161 10.0361 23.4793 10.7058 23.7297C11.8238 24.1477 13.035 24.3763 14.3 24.3763C15.565 24.3763 16.7762 24.1477 17.8942 23.7297C18.5639 23.4793 19.2001 23.161 19.7944 22.7832C22.6326 20.9789 24.5143 17.8177 24.5143 14.2195C24.5143 8.61008 19.9412 4.06272 14.3 4.06272C8.65881 4.06272 4.08571 8.61008 4.08571 14.2195C4.08571 17.8177 5.96738 20.9789 8.80562 22.7832Z" fill="white" />
            <path d="M6.51218 15.1849C5.76277 14.3369 5.76277 13.0634 6.51218 12.2155L9.15429 9.22596C9.7469 8.55542 10.5988 8.17142 11.4937 8.17142H12.0927C12.6067 8.17142 13.096 8.39197 13.4363 8.77708V8.77708C14.0357 9.45525 14.0357 10.4738 13.4363 11.1519L9.87203 15.1849C8.97966 16.1946 7.40455 16.1946 6.51218 15.1849V15.1849Z" fill="white" />
            <path fillRule="evenodd" clipRule="evenodd" d="M18.9978 20.5594C18.3542 21.2029 17.309 21.197 16.6728 20.5461L10.6078 14.3415C9.98177 13.7011 9.9876 12.6761 10.6209 12.0428V12.0428C11.2644 11.3993 12.3097 11.4052 12.9459 12.0561L19.0108 18.2607C19.6368 18.9012 19.631 19.9261 18.9978 20.5594V20.5594Z" fill="white" />
            <path d="M21.8242 11.6492C21.9185 12.1834 21.8824 12.7324 21.719 13.2496C21.5557 13.7668 21.2699 14.237 20.8859 14.6201C20.5019 15.0032 20.0311 15.2879 19.5134 15.45C18.9958 15.6121 18.4467 15.6469 17.9128 15.5513C17.5554 15.4874 17.2425 15.5584 17.06 15.743L11.9655 20.7636C11.6933 21.0246 11.33 21.169 10.9529 21.1658C10.5758 21.1627 10.2149 21.0123 9.94714 20.7468C9.67938 20.4813 9.52596 20.1217 9.51963 19.7447C9.5133 19.3677 9.65455 19.0031 9.91325 18.7288L15.0072 13.7081C15.1897 13.524 15.2586 13.21 15.1921 12.8537C15.0922 12.3206 15.1224 11.7714 15.2801 11.2525C15.4379 10.7336 15.7185 10.2605 16.0983 9.87332C16.478 9.48613 16.9455 9.19631 17.4612 9.02848C17.9769 8.86065 18.5255 8.81977 19.0604 8.90931C19.2158 8.93325 19.3605 9.00344 19.4754 9.11076C19.5904 9.21807 19.6704 9.35752 19.705 9.51095C19.7706 9.79348 19.6866 10.1044 19.4639 10.329L18.1372 11.6675C18.119 11.6868 18.1089 11.7123 18.109 11.7388C18.1091 11.7654 18.1194 11.7908 18.1378 11.8099L18.931 12.5963C18.9502 12.6146 18.9758 12.6247 19.0023 12.6246C19.0288 12.6245 19.0543 12.6141 19.0734 12.5957L20.4006 11.2583C20.5047 11.1516 20.6341 11.0729 20.7767 11.0295C20.9194 10.9861 21.0707 10.9795 21.2166 11.0102C21.5101 11.0755 21.7625 11.3017 21.8242 11.6492Z" fill="white" />
          </svg>
          {/* Always show text */}
          <span className="font-bold text-xl text-white whitespace-nowrap">TradeEase</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeSwitcher />
          {/* Always show toggle button */}
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-white/10 transition-colors"
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5 text-white" />
            ) : (
              <MenuIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Business Selector - Only show when sidebar is expanded */}
      {isExpanded && (
        <div className="px-3 py-3">
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
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 relative flex items-center bg-gray-700 rounded px-3 py-1.5">
              <Search className="h-4 w-4 text-gray-400 absolute left-2" />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-transparent border-none outline-none text-white pl-6 text-sm placeholder-gray-400"
              />
              <span className="text-xs text-gray-400 ml-1">ctrl K</span>
            </div>
            <button className="p-1 bg-green-500 text-white rounded">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
