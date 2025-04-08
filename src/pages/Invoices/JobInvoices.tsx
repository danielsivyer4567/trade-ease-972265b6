
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Plus } from "lucide-react";

export default function JobInvoices() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/quotes-invoices");
  };

  return (
    <AppLayout>
      <div className="container p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="outline" size="icon" className="mr-4" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Job Invoices</h1>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoices for Job #{jobId}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              This page will display all invoices related to job #{jobId}.
            </p>
            
            <div className="flex justify-center p-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No invoices found for this job.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
