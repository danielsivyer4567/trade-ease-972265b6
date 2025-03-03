
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Clock, DollarSign } from "lucide-react";

interface Lead {
  id: number;
  title: string;
  description: string;
  postcode: string;
  suburb: string;
  customerName: string;
  contactTime: string;
  budget: string;
}

interface PurchasedLeadCardProps {
  lead: Lead;
}

export const PurchasedLeadCard: React.FC<PurchasedLeadCardProps> = ({ lead }) => {
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
          <Users className="h-4 w-4 text-gray-500" />
          <span>Contact: {lead.customerName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>Best Time: {lead.contactTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-gray-500" />
          <span>Budget: {lead.budget}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Contact Customer</Button>
      </CardFooter>
    </Card>
  );
};
