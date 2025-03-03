
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { LeadFilters } from "./LeadFilters";
import { LeadCard } from "./LeadCard";

interface Lead {
  id: number;
  title: string;
  description: string;
  postcode: string;
  suburb: string;
  size: number;
  budget: string;
  date: string;
  status: string;
  customerName: string;
  contactTime: string;
}

interface MarketplaceTabProps {
  leads: Lead[];
  freeLeads: number;
  filters: {
    postcode: string;
    minSize: string;
    maxBudget: string;
    leadType: string;
    tradeType: string;
  };
  savedFilters: {
    name: string;
    active: boolean;
  }[];
  onFilterChange: (field: string, value: string) => void;
  onClaimFreeLead: (leadId: number) => void;
  onBuyLead: (leadId: number) => void;
}

export const MarketplaceTab: React.FC<MarketplaceTabProps> = ({
  leads,
  freeLeads,
  filters,
  savedFilters,
  onFilterChange,
  onClaimFreeLead,
  onBuyLead
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Available Leads</h2>
        <Button variant="outline" size="sm" onClick={toggleFilters}>
          <Filter className="mr-2 h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>
      
      {showFilters && (
        <LeadFilters 
          filters={filters}
          savedFilters={savedFilters}
          onFilterChange={onFilterChange}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.map(lead => (
          <LeadCard
            key={lead.id}
            lead={lead}
            freeLeads={freeLeads}
            onClaimFreeLead={onClaimFreeLead}
            onBuyLead={onBuyLead}
          />
        ))}
      </div>
    </div>
  );
};
