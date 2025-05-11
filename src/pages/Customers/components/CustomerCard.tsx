import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, MapPin, Edit, ExternalLink } from "lucide-react";
import { openCustomer } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

export interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'active' | 'inactive' | 'previous';
  customer_code?: string;
  business_name?: string;
  abn?: string;
  acn?: string;
  state_licence_state?: string;
  state_licence_number?: string;
  national_certifications?: string[];
  certification_details?: Record<string, string>;
}

interface CustomerCardProps {
  customer: CustomerData;
  onCustomerClick: (id: string) => void;
  onEditClick: (e: React.MouseEvent, customer: CustomerData) => void;
}

export const CustomerCard = ({ customer, onCustomerClick, onEditClick }: CustomerCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleOpenClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await openCustomer(customer.id);
      toast({
        title: "Success",
        description: `Opened customer: ${customer.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open customer",
        variant: "destructive"
      });
      console.error("Error opening customer:", error);
    }
  };
  
  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigate(`/customers/${customer.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to direct URL change if navigation fails
      window.location.href = `/customers/${customer.id}`;
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onCustomerClick(customer.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle 
              className="text-lg font-semibold hover:text-blue-600 hover:underline"
              onClick={handleNameClick}
            >
              {customer.name}
            </CardTitle>
            {customer.customer_code && (
              <span className="text-sm text-gray-500">Code: {customer.customer_code}</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => onEditClick(e, customer)}
            className="p-1"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{customer.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{`${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
