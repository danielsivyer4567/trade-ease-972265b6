import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Clock, DollarSign, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold text-gray-900">
              {lead.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {lead.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="shrink-0 bg-gray-50">
            {lead.postcode}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate">{lead.suburb}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span className="truncate">Budget: {lead.budget}</span>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="truncate">Contact: {lead.customerName}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="truncate">Best Time: {lead.contactTime}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button className="w-full" variant="default">
          <Phone className="h-4 w-4 mr-2" />
          Contact Customer
        </Button>
      </CardFooter>
    </Card>
  );
};
