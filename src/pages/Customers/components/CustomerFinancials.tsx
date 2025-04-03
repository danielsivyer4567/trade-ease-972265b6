
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, AlertCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CustomerFinancialsProps {
  customerId: string;
}

interface Transaction {
  id: string;
  date: string;
  type: 'invoice' | 'payment' | 'quote';
  reference: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
}

export function CustomerFinancials({ customerId }: CustomerFinancialsProps) {
  const navigate = useNavigate();
  
  // Sample data - in a real app, fetch this from your database
  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2024-05-01',
      type: 'quote',
      reference: 'Q-2024-001',
      amount: 2500.00,
      status: 'draft'
    },
    {
      id: '2',
      date: '2024-05-10',
      type: 'invoice',
      reference: 'INV-2024-001',
      amount: 2500.00,
      status: 'paid'
    },
    {
      id: '3',
      date: '2024-05-10',
      type: 'payment',
      reference: 'PAY-2024-001',
      amount: 2500.00,
      status: 'paid'
    },
    {
      id: '4',
      date: '2024-06-15',
      type: 'invoice',
      reference: 'INV-2024-002',
      amount: 1200.00,
      status: 'pending'
    },
    {
      id: '5',
      date: '2024-07-01',
      type: 'invoice',
      reference: 'INV-2024-003',
      amount: 800.00,
      status: 'overdue'
    }
  ];

  const totalInvoiced = transactions
    .filter(t => t.type === 'invoice')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalPaid = transactions
    .filter(t => t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balanceDue = transactions
    .filter(t => t.type === 'invoice' && t.status !== 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleViewStatement = () => {
    navigate(`/customers/${customerId}/statement`);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-gray-500">Total Invoiced</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <span className="text-2xl font-bold">{formatCurrency(totalInvoiced)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-gray-500">Total Paid</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="text-2xl font-bold">{formatCurrency(totalPaid)}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-gray-500">Balance Due</CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-red-500" />
              <span className="text-2xl font-bold">{formatCurrency(balanceDue)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Transactions Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Financial History</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" /> New Invoice
            </Button>
            <Button size="sm" onClick={handleViewStatement}>
              <TrendingUp className="h-4 w-4 mr-1" /> View Statement
            </Button>
          </div>
        </div>
        
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className="capitalize">{transaction.type}</TableCell>
                    <TableCell>{transaction.reference}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        <span className={`inline-block rounded-full h-2 w-2 ${getStatusColor(transaction.status)} mr-1.5`} />
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
      
      {/* Alert for overdue invoices */}
      {transactions.some(t => t.status === 'overdue') && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
          <div className="mt-0.5">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h4 className="font-medium text-red-800">Overdue Invoices</h4>
            <p className="text-sm text-red-600">
              This customer has overdue invoices. Consider sending a payment reminder.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
