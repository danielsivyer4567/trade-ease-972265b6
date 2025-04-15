
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/ui/AppLayout";
import { PurchaseOrderForm } from "./components/PurchaseOrderForm";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreatePurchaseOrder() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would call an API here
      console.log("Creating purchase order:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Purchase order created successfully");
      navigate("/purchase-orders");
    } catch (error) {
      console.error("Error creating purchase order:", error);
      toast.error("Failed to create purchase order");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/purchase-orders")}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Back to Purchase Orders
            </Button>
          </div>
          
          <PurchaseOrderForm
            onSubmit={handleSubmit}
            onCancel={() => navigate("/purchase-orders")}
          />
        </div>
      </div>
    </AppLayout>
  );
}
