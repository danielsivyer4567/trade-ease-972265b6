
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Upload, FileCheck, ArrowUpFromLine } from "lucide-react";
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="h-5 w-5 text-blue-500" />
                Upload Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Upload supplier invoices for automatic processing.
              </p>
              <Button variant="outline" className="w-full text-sm" size="sm">
                <ArrowUpFromLine className="h-4 w-4 mr-2" />
                Select File
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileCheck className="h-5 w-5 text-green-500" />
                Email Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Connected emails are automatically monitored for invoices.
              </p>
              <div className="bg-green-50 p-3 rounded-md text-xs text-green-800">
                <p>Email connections active. Invoices will be processed automatically.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-purple-500" />
                Processing Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View and manage invoices waiting to be processed.
              </p>
              <div className="bg-purple-50 p-3 rounded-md text-xs text-purple-800">
                <p>No invoices in the processing queue currently.</p>
              </div>
            </CardContent>
          </Card>
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
              This page allows users to scan and process invoices automatically, extracting key information
              and integrating with job financial data.
            </p>
            
            <div className="flex flex-col justify-center items-center p-12 border-2 border-dashed rounded-lg gap-4">
              <p className="text-muted-foreground text-center mb-4">
                Drop invoice files here or click to upload
              </p>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
