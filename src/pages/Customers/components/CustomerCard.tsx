
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, MapPin, Edit } from "lucide-react";

export interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'active' | 'inactive';
}

interface CustomerCardProps {
  customer: CustomerData;
  onCustomerClick: (id: string) => void;
  onEditClick: (e: React.MouseEvent, customer: CustomerData) => void;
}

export const CustomerCard = ({ customer, onCustomerClick, onEditClick }: CustomerCardProps) => {
  return (
    <Card 
      key={customer.id} 
      className="hover:shadow-md transition-all cursor-pointer"
      onClick={() => onCustomerClick(customer.id)}
    >
      <CardHeader className="py-3 bg-slate-200">
        <CardTitle className="text-lg flex items-center justify-between text-slate-950">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="cursor-pointer hover:text-blue-600 hover:underline">{customer.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{customer.status === 'active' ? 'Active' : 'Inactive'}</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => onEditClick(e, customer)}
              className="ml-2 p-1"
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-500" />
            {customer.phone}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            {customer.email}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            {customer.address}, {customer.city}, {customer.state} {customer.zipCode}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
