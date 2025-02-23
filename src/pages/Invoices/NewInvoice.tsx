import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileUpload } from "@/components/tasks/FileUpload";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      // Handle the uploaded files here
      toast.success(`File "${files[0].name}" uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload file");
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-8 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground mb-4">Select an invoice template to get started</p>
        <FileUpload 
          onFileUpload={handleFileUpload}
          label="Upload Invoice Template"
        />
        <Button variant="outline" className="mt-4">
          Browse Templates
        </Button>
      </div>
    </div>
  );
}

function QuoteInvoiceForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      toast.info("Searching quotes...", {
        description: `Searching for "${query}" in quotes...`
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-8 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Select a quote to convert to invoice</p>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="mt-4">
              Browse Quotes
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Search Quotes</SheetTitle>
              <SheetDescription>
                Search by customer name or quote number
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter customer name or quote number..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="mt-4">
                {searchQuery.length > 2 && (
                  <div className="text-sm text-muted-foreground">
                    Searching for quotes matching "{searchQuery}"...
                  </div>
                )}
                <div className="mt-2 space-y-2">
                  {searchResults.length === 0 && searchQuery.length > 2 && (
                    <div className="text-sm text-muted-foreground">
                      No quotes found matching your search.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

function TimesheetInvoiceForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      toast.info("Searching timesheets...", {
        description: `Searching for "${query}" in timesheets...`
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center p-8 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">Select timesheets to generate invoice</p>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="mt-4">
              Browse Timesheets
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Search Timesheets</SheetTitle>
              <SheetDescription>
                Search by employee name or timesheet number
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Enter employee name or timesheet number..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="mt-4">
                {searchQuery.length > 2 && (
                  <div className="text-sm text-muted-foreground">
                    Searching for timesheets matching "{searchQuery}"...
                  </div>
                )}
                <div className="mt-2 space-y-2">
                  {searchResults.length === 0 && searchQuery.length > 2 && (
                    <div className="text-sm text-muted-foreground">
                      No timesheets found matching your search.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
