import React, { useState } from "react";
import { LeadCard } from "./LeadCard";
import { LeadFilters } from "./LeadFilters";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

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
  isResold?: boolean;
  isFromContractor?: boolean;
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
  savedFilters: Array<{
    name: string;
    active: boolean;
  }>;
  onFilterChange: (field: string, value: string) => void;
  onSavedFilterToggle: (index: number) => void;
  onClaimFreeLead: (leadId: number) => void;
  onBuyLead: (leadId: number) => void;
}

export const MarketplaceTab: React.FC<MarketplaceTabProps> = ({
  leads,
  freeLeads,
  filters,
  savedFilters,
  onFilterChange,
  onSavedFilterToggle,
  onClaimFreeLead,
  onBuyLead
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const availableLeads = leads.filter(lead => lead.status === "available");
  
  const filteredLeads = availableLeads.filter(lead => {
    if (searchTerm && 
        !lead.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !lead.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !lead.suburb.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !lead.postcode.includes(searchTerm)) {
      return false;
    }
    
    if (filters.postcode && lead.postcode !== filters.postcode) {
      return false;
    }
    
    if (filters.minSize && lead.size < parseInt(filters.minSize)) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-4 bg-slate-100 rounded-md p-4">
      <SectionHeader title="Lead Marketplace" />
      
      <GlassCard>
        <LeadFilters 
          filters={filters} 
          savedFilters={savedFilters} 
          onFilterChange={onFilterChange} 
          onSavedFilterToggle={onSavedFilterToggle} 
        />
      </GlassCard>
      
      <SectionHeader title={`Available Leads (${filteredLeads.length})`} />
      
      {filteredLeads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map(lead => (
            <LeadCard 
              key={lead.id} 
              lead={lead} 
              freeLeads={freeLeads} 
              onClaimFreeLead={onClaimFreeLead} 
              onBuyLead={onBuyLead} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 text-center rounded-md shadow">
          <p className="text-gray-500">No leads match your current filters.</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or check back later for new leads.</p>
        </div>
      )}
    </div>
  );
};
