import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { InvoiceForm } from "./components/InvoiceForm";
import { toast } from "sonner";

export default function NewInvoice() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/invoices");
  };

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Implement API call to create invoice
      console.log("Creating invoice:", data);
      toast.success("Invoice created successfully");
      navigate("/invoices");
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-4 rounded-md border border-gray-300" 
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Create New Invoice</h1>
        </div>
        
        <InvoiceForm
          onSubmit={handleSubmit}
          onCancel={handleBack}
        />
      </div>
    </AppLayout>
  );
}
