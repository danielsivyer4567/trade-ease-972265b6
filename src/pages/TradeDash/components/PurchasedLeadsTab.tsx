
import React from "react";
import { PurchasedLeadCard } from "./PurchasedLeadCard";

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
      <h2 className="text-2xl font-semibold mb-4">My Purchased Leads</h2>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {purchasedLeads.map(lead => (
            <PurchasedLeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      </div>
    </div>
  );
};
