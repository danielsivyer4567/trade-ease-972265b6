
import React, { useState, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export default function CustomerStatement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch customer data
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .single();
        
        if (customerError) throw customerError;
        setCustomer(customerData);
        
        // Mock transaction data - in a real app you'd fetch this from your database
        // Sample data - in a real app, fetch this from your database
        const mockTransactions = [
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
            amount: -2500.00, // Negative for payments
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
        
        setTransactions(mockTransactions);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load statement data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your statement PDF is being generated",
    });
    // In a real app, this would generate and download a PDF
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    // In a real app, you would refetch data based on the selected date range
  };

  const calculateBalance = () => {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 flex justify-center items-center h-full">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-slate-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-64 mx-auto"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!customer) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-4">Customer not found</h1>
            <Button onClick={() => navigate('/customers')}>
              Back to Customers
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate(`/customers/${id}`)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <h1 className="text-2xl font-bold">Account Statement</h1>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" /> Print
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" /> Download PDF
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {dateRange === '30days' && 'Last 30 Days'}
                  {dateRange === '90days' && 'Last 90 Days'}
                  {dateRange === 'year' && 'Last Year'}
                  {dateRange === 'all' && 'All Time'}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleDateRangeChange('30days')}>
                  Last 30 Days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDateRangeChange('90days')}>
                  Last 90 Days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDateRangeChange('year')}>
                  Last Year
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDateRangeChange('all')}>
                  All Time
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Customer Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg">{customer.name}</h3>
                <p className="text-gray-600">{customer.address}</p>
                <p className="text-gray-600">{customer.city}, {customer.state} {customer.zipcode}</p>
                <p className="text-gray-600">{customer.email}</p>
                <p className="text-gray-600">{customer.phone}</p>
              </div>
              <div className="md:text-right">
                <p className="text-gray-600">Account Summary</p>
                <p className="font-bold text-lg">Current Balance: {formatCurrency(calculateBalance())}</p>
                <p className="text-sm text-gray-600">Statement Date: {formatDate(new Date().toISOString())}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className="capitalize">{transaction.type}</TableCell>
                    <TableCell>{transaction.reference}</TableCell>
                    <TableCell className="capitalize">{transaction.status}</TableCell>
                    <TableCell className={`text-right ${transaction.amount < 0 ? 'text-green-600' : ''}`}>
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-gray-50">
                  <TableCell colSpan={4}>Balance</TableCell>
                  <TableCell className="text-right">{formatCurrency(calculateBalance())}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
