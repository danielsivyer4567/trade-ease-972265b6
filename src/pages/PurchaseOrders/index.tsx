
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, FileDown, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  status: 'draft' | 'sent' | 'partially-received' | 'received' | 'cancelled';
}

const PurchaseOrdersPage = () => {
  // Sample purchase orders data - in a real app, this would be fetched from your database
  const purchaseOrders: PurchaseOrder[] = [
    {
      id: '1',
      poNumber: 'PO-2024-001',
      supplier: 'Lumber Supplies Inc.',
      orderDate: '2024-04-01',
      deliveryDate: '2024-04-10',
      totalAmount: 2750.00,
      status: 'received'
    },
    {
      id: '2',
      poNumber: 'PO-2024-002',
      supplier: 'Hardware Depot',
      orderDate: '2024-04-15',
      deliveryDate: '2024-04-25',
      totalAmount: 1250.75,
      status: 'sent'
    },
    {
      id: '3',
      poNumber: 'PO-2024-003',
      supplier: 'Electrical Components Ltd.',
      orderDate: '2024-05-01',
      deliveryDate: '2024-05-15',
      totalAmount: 3000.00,
      status: 'partially-received'
    },
    {
      id: '4',
      poNumber: 'PO-2024-004',
      supplier: 'Paint Supplies Co.',
      orderDate: '2024-05-10',
      deliveryDate: '2024-05-20',
      totalAmount: 875.50,
      status: 'draft'
    },
    {
      id: '5',
      poNumber: 'PO-2024-005',
      supplier: 'Tools & Equipment Inc.',
      orderDate: '2024-05-15',
      deliveryDate: '2024-05-25',
      totalAmount: 4250.00,
      status: 'sent'
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Draft</Badge>;
      case 'sent':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Sent</Badge>;
      case 'partially-received':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Partially Received</Badge>;
      case 'received':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Received</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDeliveryStatus = (deliveryDate: string) => {
    const today = new Date();
    const delivery = new Date(deliveryDate);
    
    if (delivery < today) {
      return <span className="flex items-center text-red-600 text-xs font-medium">
        <Clock className="h-3 w-3 mr-1" />
        Overdue
      </span>;
    }
    
    const diffTime = Math.abs(delivery.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return <span className="text-amber-600 text-xs font-medium">Due in {diffDays} days</span>;
    }
    
    return <span className="text-gray-500 text-xs">On schedule</span>;
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Purchase Orders</h1>
              <p className="text-gray-500">Create and manage purchase orders to suppliers</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>New Purchase Order</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{purchaseOrders.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Open Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {purchaseOrders.filter(po => ['sent', 'partially-received'].includes(po.status)).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(purchaseOrders.reduce((total, po) => total + po.totalAmount, 0))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Purchase Orders</CardTitle>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search orders..."
                      className="pl-8 w-full sm:w-[250px]"
                    />
                  </div>
                  
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="icon">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PO Number</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.map((po) => (
                      <TableRow key={po.id} className="cursor-pointer hover:bg-gray-50">
                        <TableCell className="font-medium">{po.poNumber}</TableCell>
                        <TableCell>{po.supplier}</TableCell>
                        <TableCell>{formatDate(po.orderDate)}</TableCell>
                        <TableCell>
                          <div>
                            {formatDate(po.deliveryDate)}
                            <div>
                              {getDeliveryStatus(po.deliveryDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(po.totalAmount)}</TableCell>
                        <TableCell>{getStatusBadge(po.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default PurchaseOrdersPage;
