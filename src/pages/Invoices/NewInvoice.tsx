
import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function NewInvoice() {
  const [selectedTab, setSelectedTab] = useState("blank");

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Create New Invoice
          </h1>
        </div>

        <Card className="p-6">
          <Tabs defaultValue="blank" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="blank">Blank Invoice</TabsTrigger>
              <TabsTrigger value="template">From Template</TabsTrigger>
              <TabsTrigger value="quote">From Quote</TabsTrigger>
              <TabsTrigger value="timesheet">From Timesheet</TabsTrigger>
            </TabsList>

            <TabsContent value="blank" className="space-y-4 mt-4">
              <BlankInvoiceForm />
            </TabsContent>

            <TabsContent value="template" className="space-y-4 mt-4">
              <TemplateInvoiceForm />
            </TabsContent>

            <TabsContent value="quote" className="space-y-4 mt-4">
              <QuoteInvoiceForm />
            </TabsContent>

            <TabsContent value="timesheet" className="space-y-4 mt-4">
              <TimesheetInvoiceForm />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  );
}

function BlankInvoiceForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Implement invoice creation logic here
      toast.success("Invoice created successfully");
    } catch (error) {
      toast.error("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="customer">Customer</Label>
        <Input id="customer" placeholder="Select customer" required />
      </div>

      <div>
        <Label htmlFor="items">Line Items</Label>
        <Textarea id="items" placeholder="Enter invoice items" rows={4} required />
      </div>

      <div>
        <Label htmlFor="amount">Total Amount</Label>
        <Input id="amount" type="number" placeholder="Enter total amount" required />
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input id="dueDate" type="date" required />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Creating Invoice..." : "Create Invoice"}
      </Button>
    </form>
  );
}

function TemplateInvoiceForm() {
  return (
    <div className="space-y-4">
      <div className="text-center p-8 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Select an invoice template to get started</p>
        <Button variant="outline" className="mt-4">
          Browse Templates
        </Button>
      </div>
    </div>
  );
}

function QuoteInvoiceForm() {
  return (
    <div className="space-y-4">
      <div className="text-center p-8 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Select a quote to convert to invoice</p>
        <Button variant="outline" className="mt-4">
          Browse Quotes
        </Button>
      </div>
    </div>
  );
}

function TimesheetInvoiceForm() {
  return (
    <div className="space-y-4">
      <div className="text-center p-8 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Select timesheets to generate invoice</p>
        <Button variant="outline" className="mt-4">
          Browse Timesheets
        </Button>
      </div>
    </div>
  );
}
