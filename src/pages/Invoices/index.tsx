import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Plus, Search } from "lucide-react";

// Mock invoice data for demonstration
const invoices = [
  { id: "INV-0001", customer: "John Smith", amount: 2500, date: "2024-03-15", status: "paid" },
  { id: "INV-0002", customer: "Sarah Johnson", amount: 1800, date: "2024-03-20", status: "pending" },
  { id: "INV-0003", customer: "Michael Brown", amount: 3200, date: "2024-03-22", status: "overdue" },
  { id: "INV-0004", customer: "Jessica Williams", amount: 950, date: "2024-03-25", status: "pending" },
  { id: "INV-0005", customer: "David Miller", amount: 4100, date: "2024-03-27", status: "draft" },
];

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

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
    <AppLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Invoices</h1>
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button onClick={handleNewInvoice} className="whitespace-nowrap">
              <Plus className="mr-1 h-4 w-4" /> New Invoice
            </Button>
          </div>
        </div>

        <Card className="bg-white rounded-lg shadow-sm">
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Invoice #</th>
                    <th className="text-left p-3 font-medium">Customer</th>
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Amount</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{invoice.id}</td>
                      <td className="p-3">{invoice.customer}</td>
                      <td className="p-3">{new Date(invoice.date).toLocaleDateString()}</td>
                      <td className="p-3">${invoice.amount.toFixed(2)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                          ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/invoices/${invoice.id}`)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInvoices.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500">No invoices found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 