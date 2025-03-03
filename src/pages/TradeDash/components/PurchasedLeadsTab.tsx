
import React from "react";
import { PurchasedLeadCard } from "./PurchasedLeadCard";
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
}

interface PurchasedLeadsTabProps {
  purchasedLeads: Lead[];
}

export const PurchasedLeadsTab: React.FC<PurchasedLeadsTabProps> = ({ purchasedLeads }) => {
  return (
    <div className="space-y-4">
      <SectionHeader title="My Purchased Leads" />
      <GlassCard>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {purchasedLeads.map(lead => (
            <PurchasedLeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
