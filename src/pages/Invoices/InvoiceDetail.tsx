import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Printer, Download, Edit, Trash2 } from "lucide-react";
import { InvoiceForm } from './components/InvoiceForm';
import { useInvoices } from "@/hooks/useInvoices";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { invoices, updateInvoice, deleteInvoice } = useInvoices();

  const invoice = invoices?.find(inv => inv.id === id);

  const handleBack = () => {
    navigate("/invoices");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      await updateInvoice.mutateAsync({
        id: id!,
        ...data,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInvoice.mutateAsync(id!);
      navigate("/invoices");
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!invoice) {
    return (
      <AppLayout>
        <div className="container p-6 max-w-5xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Invoice Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The invoice you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={handleBack}>Return to Invoices</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

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
            <h1 className="text-2xl font-bold">Edit Invoice #{invoice.invoice_number}</h1>
          </div>
          
          <InvoiceForm
            initialData={invoice}
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
            <h1 className="text-2xl font-bold">Invoice #{invoice.invoice_number}</h1>
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
            <Button 
              variant="destructive" 
              className="flex items-center gap-1"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
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
                  <p>{invoice.invoice_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{format(new Date(invoice.issue_date), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Amount</p>
                  <p className="text-lg font-bold">
                    ${invoice.total_amount.toFixed(2)}
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
                      {invoice.items.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{item.description}</td>
                          <td className="px-4 py-2 text-right">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">${item.unit_price.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {invoice.notes && (
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Notes</h3>
                  <p className="text-gray-600">{invoice.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this invoice? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
