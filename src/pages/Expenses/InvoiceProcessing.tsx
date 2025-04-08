
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InvoiceProcessing() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/expenses");
  };

  return (
    <AppLayout>
      <div className="container p-6 max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-4" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Invoice Processing</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Automated Invoice Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              This page will allow users to scan and process invoices automatically, extracting key information
              and integrating with job financial data.
            </p>
            
            <div className="flex justify-center p-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Invoice processing functionality is under development.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
