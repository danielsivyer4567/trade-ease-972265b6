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
  status: 'active' | 'inactive';
  customer_code?: string;
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
      key={customer.id} 
      className="hover:shadow-md transition-all cursor-pointer"
      onClick={() => onCustomerClick(customer.id)}
    >
      <CardHeader className="py-3 bg-slate-300">
        <CardTitle className="text-lg flex items-center justify-between text-slate-950">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <span 
              className="cursor-pointer hover:text-blue-600 hover:underline"
              onClick={handleNameClick}
            >
              {customer.name}
            </span>
            {customer.customer_code && (
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                {customer.customer_code}
              </span>
            )}
            <Button 
              variant="default" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                try {
                  navigate(`/customers/${customer.id}`);
                } catch (error) {
                  console.error('Navigation error:', error);
                  // Fallback to direct URL change if navigation fails
                  window.location.href = `/customers/${customer.id}`;
                }
              }}
              className="px-2 py-1 h-7 text-xs ml-2"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Open Portfolio
            </Button>
          </div>
          <div className="flex items-center gap-2">
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
