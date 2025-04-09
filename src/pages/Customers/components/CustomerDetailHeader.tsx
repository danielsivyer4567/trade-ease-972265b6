
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomerDetailHeaderProps {
  customerId: string;
  customerName: string;
}

export const CustomerDetailHeader = ({ customerId, customerName }: CustomerDetailHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
      <div className="flex items-center gap-2 max-w-[70%]">
        <Button variant="outline" size="sm" onClick={() => navigate('/customers')} className="rounded-md border border-gray-300 shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold truncate">{customerName}</h1>
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto justify-end">
        <Button variant="outline" onClick={() => navigate(`/customers/edit/${customerId}`)} className="flex items-center gap-1">
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
        <Button variant="destructive" onClick={() => {
          toast({
            title: "Not implemented",
            description: "Delete functionality will be implemented in future versions"
          });
        }} className="flex items-center gap-1">
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
    </div>
  );
};
