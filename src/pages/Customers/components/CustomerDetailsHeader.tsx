
import React from 'react';
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, FileText, Clipboard } from "lucide-react";

interface CustomerDetailsHeaderProps {
  customer: {
    name: string;
    status: 'active' | 'inactive';
    id: string;
  };
  onCreateQuote?: (customerId: string) => void;
  onCreateJob?: (customerId: string) => void;
}

export function CustomerDetailsHeader({ 
  customer, 
  onCreateQuote, 
  onCreateJob 
}: CustomerDetailsHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <CardTitle className="text-xl font-bold flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        {customer.name}
        <Badge variant={customer.status === 'active' ? "default" : "secondary"}>
          {customer.status}
        </Badge>
      </CardTitle>
      <div className="flex gap-2">
        {onCreateQuote && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onCreateQuote(customer.id)}
            className="text-sm"
          >
            <FileText className="h-4 w-4 mr-1" /> New Quote
          </Button>
        )}
        {onCreateJob && (
          <Button 
            size="sm" 
            onClick={() => onCreateJob(customer.id)}
            className="text-sm"
          >
            <Clipboard className="h-4 w-4 mr-1" /> New Job
          </Button>
        )}
      </div>
    </div>
  );
}
