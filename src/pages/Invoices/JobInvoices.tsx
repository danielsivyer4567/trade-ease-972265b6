import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Mock data - replace with actual API call
const mockInvoices = [
  { 
    id: "INV-001", 
    customer: "John Smith", 
    amount: 2500, 
    date: "2024-03-15", 
    status: "paid" 
  },
  { 
    id: "INV-002", 
    customer: "Sarah Johnson", 
    amount: 1800, 
    date: "2024-03-20", 
    status: "pending" 
  }
];

export default function JobInvoices() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleBack = () => {
    navigate("/jobs/" + jobId);
  };

  const handleNewInvoice = () => {
    navigate("/invoices/new?jobId=" + jobId);
  };

  const filteredInvoices = searchQuery
    ? mockInvoices.filter(invoice => 
        invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockInvoices;

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
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            </div>
            <Button onClick={handleNewInvoice} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Invoice
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoices for Job #{jobId}
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                  <p className="text-gray-500">No invoices found for this job</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
