
import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Plus, FileText, Clock, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';

const mockInvoices = [
  {
    id: 'INV-001',
    customer: 'John Smith',
    job: 'Bathroom Renovation',
    amount: 2500,
    status: 'paid',
    date: '2023-05-10'
  },
  {
    id: 'INV-002',
    customer: 'Emily Johnson',
    job: 'Kitchen Remodel',
    amount: 5750,
    status: 'pending',
    date: '2023-05-12'
  },
  {
    id: 'INV-003',
    customer: 'Michael Brown',
    job: 'Plumbing Repair',
    amount: 450,
    status: 'overdue',
    date: '2023-05-05'
  },
  {
    id: 'INV-004',
    customer: 'Sarah Wilson',
    job: 'Electrical Upgrade',
    amount: 1200,
    status: 'draft',
    date: '2023-05-15'
  },
  {
    id: 'INV-005',
    customer: 'David Taylor',
    job: 'Roof Repair',
    amount: 3800,
    status: 'paid',
    date: '2023-05-08'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'paid':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'pending':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'overdue':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'draft':
      return <FileText className="h-5 w-5 text-gray-500" />;
    default:
      return <FileText className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'paid':
      return 'Paid';
    case 'pending':
      return 'Pending';
    case 'overdue':
      return 'Overdue';
    case 'draft':
      return 'Draft';
    default:
      return status;
  }
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

const InvoicesPage = () => {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold">Invoices</h1>
          </div>
          <Link to="/invoices/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Invoice #</th>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Job</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link to={`/invoices/${invoice.id}`} className="text-blue-600 hover:text-blue-800">
                          {invoice.id}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{invoice.customer}</td>
                      <td className="py-3 px-4">{invoice.job}</td>
                      <td className="py-3 px-4">${invoice.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(invoice.status)}`}>
                            {getStatusText(invoice.status)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{new Date(invoice.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/invoices/${invoice.id}`}>View</Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default InvoicesPage;
