import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, Phone, DollarSign } from "lucide-react";
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
  return <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow bg-slate-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">{lead.title}</CardTitle>
          <Badge variant="outline" className="whitespace-nowrap">
            {lead.postcode}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-2 bg-slate-300">
        <div className="space-y-2">
          <p className="text-sm text-gray-600 line-clamp-3 min-h-[3rem]">{lead.description}</p>
          
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{lead.suburb}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{lead.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span>Budget: {lead.budget}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4 text-gray-500" />
              <span>{lead.size}m²</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex flex-col md:flex-row gap-2 w-full">
        {hasFreeLeadsAvailable ? <Button onClick={() => onClaimFreeLead(lead.id)} className="w-full bg-green-600 hover:bg-green-700 text-white">
            Claim Free Lead
          </Button> : <Button onClick={() => onBuyLead(lead.id)} className="w-full">
            Buy Lead
          </Button>}
      </CardFooter>
    </Card>;
};