
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppLayout } from '@/components/ui/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Printer, Download, Send, Edit, DollarSign } from 'lucide-react';

const mockInvoiceData = {
  id: 'INV-001',
  customer: {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, CA 12345'
  },
  job: {
    title: 'Bathroom Renovation',
    number: 'JOB-2023-056',
    address: '123 Main St, Anytown, CA 12345'
  },
  invoiceDate: '2023-05-10',
  dueDate: '2023-05-24',
  status: 'paid',
  paymentDate: '2023-05-15',
  subtotal: 2300,
  tax: 200,
  total: 2500,
  lineItems: [
    { description: 'Labor - Demolition', quantity: 8, unit: 'hours', rate: 75, amount: 600 },
    { description: 'Labor - Installation', quantity: 10, unit: 'hours', rate: 85, amount: 850 },
    { description: 'Materials - Tiles', quantity: 50, unit: 'sq ft', rate: 12, amount: 600 },
    { description: 'Materials - Fixtures', quantity: 1, unit: 'set', rate: 250, amount: 250 }
  ]
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function InvoiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const invoice = mockInvoiceData; // In a real app, fetch based on id
  
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/invoices">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-gray-700" />
              <h1 className="text-3xl font-bold">Invoice {invoice.id}</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" /> Download
            </Button>
            <Button variant="outline" size="sm">
              <Send className="h-4 w-4 mr-1" /> Send
            </Button>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Bill To:</h3>
                    <div className="mt-1">
                      <p className="font-medium">{invoice.customer.name}</p>
                      <p>{invoice.customer.address}</p>
                      <p>{invoice.customer.email}</p>
                      <p>{invoice.customer.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-semibold">Invoice:</h3>
                    <div className="mt-1">
                      <p><span className="font-medium">Number:</span> {invoice.id}</p>
                      <p><span className="font-medium">Date:</span> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                      <p><span className="font-medium">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                      <p>
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusClass(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Items:</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Description</th>
                        <th className="text-right py-2 font-medium">Quantity</th>
                        <th className="text-right py-2 font-medium">Unit</th>
                        <th className="text-right py-2 font-medium">Rate</th>
                        <th className="text-right py-2 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.lineItems.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{item.description}</td>
                          <td className="py-2 text-right">{item.quantity}</td>
                          <td className="py-2 text-right">{item.unit}</td>
                          <td className="py-2 text-right">${item.rate.toFixed(2)}</td>
                          <td className="py-2 text-right">${item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} className="pt-4 text-right font-medium">Subtotal:</td>
                        <td className="pt-4 text-right">${invoice.subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="pt-2 text-right font-medium">Tax:</td>
                        <td className="pt-2 text-right">${invoice.tax.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan={4} className="pt-2 text-right font-bold">Total:</td>
                        <td className="pt-2 text-right font-bold">${invoice.total.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Related Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-semibold mb-2">Job Information</h3>
                  <div className="space-y-1">
                    <p><span className="font-medium">Job:</span> {invoice.job.title}</p>
                    <p><span className="font-medium">Job #:</span> {invoice.job.number}</p>
                    <p><span className="font-medium">Location:</span> {invoice.job.address}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-semibold mb-2">Payment Information</h3>
                  <div className="space-y-1">
                    <p><span className="font-medium">Status:</span> {invoice.status}</p>
                    {invoice.status === 'paid' && (
                      <p><span className="font-medium">Paid on:</span> {new Date(invoice.paymentDate).toLocaleDateString()}</p>
                    )}
                    <p><span className="font-medium">Payment Terms:</span> Net 14 days</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-gray-600">
                    Thank you for your business. Please make payment by the due date.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
