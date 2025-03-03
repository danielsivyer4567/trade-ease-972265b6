
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Maximize2, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";

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

interface LeadCardProps {
  lead: Lead;
  freeLeads: number;
  onClaimFreeLead: (leadId: number) => void;
  onBuyLead: (leadId: number) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, freeLeads, onClaimFreeLead, onBuyLead }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{lead.title}</CardTitle>
        <CardDescription>{lead.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span>{lead.suburb}, {lead.postcode}</span>
        </div>
        <div className="flex items-center gap-2">
          <Maximize2 className="h-4 w-4 text-gray-500" />
          <span>Size: {lead.size} sqm</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span>Budget: {lead.budget}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>Date Posted: {lead.date}</span>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        {lead.status === "available" ? (
          <>
            {freeLeads > 0 ? (
              <Button variant="secondary" onClick={() => onClaimFreeLead(lead.id)}>
                Claim Free Lead ({freeLeads} left)
              </Button>
            ) : (
              <Button onClick={() => onBuyLead(lead.id)}>Buy Lead</Button>
            )}
          </>
        ) : (
          <Badge variant="outline">Purchased</Badge>
        )}
      </CardFooter>
    </Card>
  );
};
