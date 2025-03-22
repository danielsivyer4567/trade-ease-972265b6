import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, Phone, DollarSign, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  freeLeads,
  onClaimFreeLead,
  onBuyLead
}) => {
  const hasFreeLeadsAvailable = freeLeads > 0;

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2">
            {lead.title}
          </CardTitle>
          <Badge variant="outline" className="shrink-0 bg-gray-50">
            {lead.postcode}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {lead.description}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate">{lead.suburb}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="truncate">{lead.date}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="truncate">Budget: {lead.budget}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4 text-gray-400" />
            <span className="truncate">{lead.size}m²</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        {hasFreeLeadsAvailable ? (
          <Button 
            onClick={() => onClaimFreeLead(lead.id)} 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Claim Free Lead
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={() => onBuyLead(lead.id)} 
            className="w-full"
          >
            Buy Lead
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};