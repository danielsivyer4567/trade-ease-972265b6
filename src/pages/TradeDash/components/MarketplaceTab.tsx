
import React from "react";
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
}

interface Filters {
  postcode: string;
  minSize: string;
  maxBudget: string;
  leadType: string;
  tradeType: string;
}

interface SavedFilter {
  name: string;
  active: boolean;
}

interface MarketplaceTabProps {
  leads: Lead[];
  freeLeads: number;
  filters: Filters;
  savedFilters: SavedFilter[];
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
  onBuyLead,
}) => {
  const availableLeads = leads.filter(lead => lead.status === "available");
  
  return (
    <div className="space-y-6">
      <SectionHeader title="Available Leads Marketplace" />
      
      <GlassCard>
        <LeadFilters 
          filters={filters}
          savedFilters={savedFilters}
          onFilterChange={onFilterChange}
        />
      </GlassCard>
      
      <GlassCard>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableLeads.length > 0 ? (
            availableLeads.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClaimFreeLead={onClaimFreeLead}
                onBuyLead={onBuyLead}
                freeLeads={freeLeads}
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No leads match your current filters. Try adjusting your search criteria.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
