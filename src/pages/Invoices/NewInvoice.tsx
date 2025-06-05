import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function NewInvoice() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/invoices");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" className="mr-4 rounded-md border border-gray-300" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create New Invoice</h1>
      </div>
      
      <Card className="bg-white">
        <CardContent className="p-6">
          <p className="text-center text-gray-500 py-20">
            Invoice creation form will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
