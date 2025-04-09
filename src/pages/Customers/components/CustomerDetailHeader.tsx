
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
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/customers')} className="rounded-md border border-gray-300">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{customerName}</h1>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate(`/customers/edit/${customerId}`)} className="flex items-center gap-1">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" onClick={() => {
          toast({
            title: "Not implemented",
            description: "Delete functionality will be implemented in future versions"
          });
        }} className="flex items-center gap-1">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};
