
import { useState } from "react";

export interface LeadFilter {
  postcode: string;
  minSize: string;
  maxBudget: string;
  leadType: string;
  tradeType: string;
  includeResold?: boolean;
  includeContractorLeads?: boolean;
  searchTerm?: string;
  selectedPostcodes?: string[];
}

export interface SavedFilter {
  name: string;
  active: boolean;
}

export const useLeadFilters = () => {
  const [filters, setFilters] = useState<LeadFilter>({
    postcode: "",
    minSize: "",
    maxBudget: "",
    leadType: "all",
    tradeType: "All Trades",
    includeResold: false,
    includeContractorLeads: false,
    searchTerm: "",
    selectedPostcodes: []
  });
  
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([
    { name: "Sydney CBD Jobs", active: true },
    { name: "Large Renovations", active: false },
    { name: "Small Quick Jobs", active: false },
    { name: "Emergency Calls", active: false },
    { name: "High-Value Projects", active: false },
  ]);
  
  const handleFilterChange = (field: string, value: string) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  const toggleSavedFilter = (index: number) => {
    const newFilters = [...savedFilters];
    newFilters[index].active = !newFilters[index].active;
    setSavedFilters(newFilters);
    
    if (newFilters[index].active) {
      if (index === 0) { // Sydney CBD Jobs
        setFilters({...filters, postcode: "2000"});
      } else if (index === 1) { // Large Renovations
        setFilters({...filters, minSize: "100"});
      } else if (index === 2) { // Small Quick Jobs
        setFilters({...filters, maxBudget: "2000"});
      } else if (index === 3) { // Emergency Calls
        setFilters({...filters, leadType: "emergency"});
      } else if (index === 4) { // High-Value Projects
        setFilters({...filters, maxBudget: "50000"});
      }
    }
  };

  return {
    filters,
    savedFilters,
    handleFilterChange,
    toggleSavedFilter
  };
};
