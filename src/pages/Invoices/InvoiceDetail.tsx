import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Printer, Download, Edit } from "lucide-react";
import { InvoiceForm } from './components/InvoiceForm';
import { toast } from "sonner";

// Mock data - replace with actual API call
const mockInvoice = {
  invoiceNumber: "INV-001",
  customerId: "customer-1",
  issueDate: new Date(),
  dueDate: new Date(),
  status: "draft" as const,
  items: [
    {
      description: "Sample Item",
      quantity: 1,
      unitPrice: 100,
      total: 100
    }
  ],
  notes: "Sample invoice notes",
  attachments: []
};

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const handleBack = () => {
    navigate("/invoices");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Implement API call to update invoice
      console.log("Updating invoice:", data);
      toast.success("Invoice updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <AppLayout>
        <div className="container p-6 max-w-7xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              size="icon" 
              className="mr-4" 
              onClick={handleCancel}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Edit Invoice #{id}</h1>
          </div>
          
          <InvoiceForm
            initialData={mockInvoice}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="outline" size="icon" className="mr-4" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Invoice #{id}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-1" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-md">
                <div>
                  <p className="text-sm font-medium text-gray-500">Invoice Number</p>
                  <p>{mockInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{mockInvoice.issueDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {mockInvoice.status.charAt(0).toUpperCase() + mockInvoice.status.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="text-lg font-bold">
                    ${mockInvoice.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Items</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Description</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Quantity</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Unit Price</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockInvoice.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{item.description}</td>
                          <td className="px-4 py-2 text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {mockInvoice.notes && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Notes</h3>
                  <p className="text-gray-600">{mockInvoice.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
