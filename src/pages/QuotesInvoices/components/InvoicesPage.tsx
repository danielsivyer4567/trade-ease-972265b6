
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter, Plus, Search } from "lucide-react";
import { InvoicesList } from "./InvoicesList";
import { useNavigate } from "react-router-dom";

export function InvoicesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock invoice data for demonstration
  const invoices = [
    { id: "INV-0001", customer: "John Smith", amount: 2500, date: "2023-05-15", status: "paid" },
    { id: "INV-0002", customer: "Sarah Johnson", amount: 1800, date: "2023-05-20", status: "pending" },
    { id: "INV-0003", customer: "Michael Brown", amount: 3200, date: "2023-05-22", status: "overdue" },
    { id: "INV-0004", customer: "Jessica Williams", amount: 950, date: "2023-05-25", status: "pending" },
    { id: "INV-0005", customer: "David Miller", amount: 4100, date: "2023-05-27", status: "draft" },
  ];

  const filteredInvoices = searchQuery
    ? invoices.filter(invoice => 
        invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : invoices;

  const handleNewInvoice = () => {
    navigate("/invoices/new");
  };

  return (
    <div className="w-full">
      <Card className="bg-white rounded-lg shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-bold mb-2 md:mb-0">Invoices</h2>
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative w-full md:w-auto flex-1 md:flex-initial">
                <Input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              </div>
              <Button onClick={handleNewInvoice} className="whitespace-nowrap">
                <Plus className="mr-1 h-4 w-4" /> New Invoice
              </Button>
            </div>
          </div>
          
          <InvoicesList invoices={filteredInvoices} />
        </CardContent>
      </Card>
    </div>
  );
}
