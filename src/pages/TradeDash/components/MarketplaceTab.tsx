import React, { useState } from "react";
import { LeadCard } from "./LeadCard";
import { LeadFilters } from "./LeadFilters";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
    <div className="space-y-6">
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search leads by title, description, suburb or postcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <LeadFilters 
              filters={filters} 
              savedFilters={savedFilters} 
              onFilterChange={onFilterChange} 
              onSavedFilterToggle={onSavedFilterToggle} 
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between">
        <SectionHeader title="Available Leads" />
        <span className="text-sm text-gray-500">
          {filteredLeads.length} leads found
        </span>
      </div>
      
      {filteredLeads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <Card className="bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600 font-medium">No leads match your current filters</p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your filters or check back later for new leads
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
