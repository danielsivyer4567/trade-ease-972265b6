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

  // Add safe getters for customer properties
  const getName = () => customer?.name || 'Unnamed Customer';
  const getEmail = () => customer?.email || '';
  const getPhone = () => customer?.phone || '';
  const getAddress = () => customer?.address || '';
  const getCity = () => customer?.city || '';
  const getState = () => customer?.state || '';
  const getZipCode = () => customer?.zipCode || '';
  const getCustomerCode = () => customer?.customer_code || '';

  const handleOpenClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await openCustomer(customer.id);
      toast({
        title: "Success",
        description: `Opened customer: ${getName()}`,
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

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click from triggering
  };

  // Only show email if it's available
  const hasEmail = getEmail().length > 0;
  // Only show phone if it's available
  const hasPhone = getPhone().length > 0;
  // Only show address if at least some address component is available
  const hasAddress = getAddress().length > 0 || getCity().length > 0 || getState().length > 0;

  return (
    <Card 
      key={customer.id} 
      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
      onClick={() => onCustomerClick(customer.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
            <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h3 className="font-semibold">{getName()}</h3>
            {getCustomerCode() && (
              <span className="text-sm text-gray-500">Code: {getCustomerCode()}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {`${getAddress()}${getCity() ? `, ${getCity()}` : ''}${getState() ? `, ${getState()}` : ''} ${getZipCode()}`}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Status: <span className="font-medium text-green-600">{customer.status}</span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => onEditClick(e, customer)}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
