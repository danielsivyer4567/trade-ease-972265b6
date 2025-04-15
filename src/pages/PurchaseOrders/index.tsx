
import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Printer, Mail, Download, MoreHorizontal } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PurchaseOrder {
  id: string;
  orderNo: string;
  supplier: string;
  reference: string;
  linkedBill: string;
  status: 'billed' | 'pending' | 'draft';
  job: string;
  orderDate: string;
  deliveryDate: string;
  total: number;
  sent: boolean;
}

const purchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    orderNo: 'PO00005',
    supplier: 'Aaa Timber And Hardware',
    reference: '',
    linkedBill: 'Aaa Timber And Hardware',
    status: 'billed',
    job: 'JB00763',
    orderDate: '21 Jan 2025',
    deliveryDate: '21 Jan 2025',
    total: 500.00,
    sent: true
  },
  {
    id: '2',
    orderNo: 'PO00004',
    supplier: 'Jackson Ryan',
    reference: '',
    linkedBill: 'Jackson Ryan - 18 Jan 2025',
    status: 'billed',
    job: 'JB00764',
    orderDate: '18 Jan 2025',
    deliveryDate: '18 Jan 2025',
    total: 0.00,
    sent: true
  },
  {
    id: '3',
    orderNo: 'PO00003',
    supplier: 'China',
    reference: '',
    linkedBill: 'China - 18 Jan 2025',
    status: 'billed',
    job: 'JB00764',
    orderDate: '18 Jan 2025',
    deliveryDate: '18 Jan 2025',
    total: 1100.00,
    sent: true
  }
];

export default function PurchaseOrders() {
  const [selectedTab, setSelectedTab] = useState('all');

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="draft">Draft P/O (2)</TabsTrigger>
                  <TabsTrigger value="unbilled">Unbilled P/O</TabsTrigger>
                  <TabsTrigger value="billed">Billed P/O (3)</TabsTrigger>
                  <TabsTrigger value="all">All P/O (5)</TabsTrigger>
                  <TabsTrigger value="draft-bills">Draft Bills (2)</TabsTrigger>
                  <TabsTrigger value="approved">Approved Bills (234)</TabsTrigger>
                  <TabsTrigger value="all-bills">All Bills (252)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Printer className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Button className="bg-[#00A3BE] hover:bg-[#008CA3]">
                New Purchase Order
              </Button>
              <div className="relative w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="pl-9"
                />
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order No</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Linked Bill</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Job</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Sent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/50 cursor-pointer">
                        <TableCell>{order.orderNo}</TableCell>
                        <TableCell>{order.supplier}</TableCell>
                        <TableCell>{order.reference}</TableCell>
                        <TableCell>{order.linkedBill}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-[#61BD4F] text-white">
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.job}</TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell>{order.deliveryDate}</TableCell>
                        <TableCell className="text-right">{order.total.toFixed(2)}</TableCell>
                        <TableCell>{order.sent ? "Yes" : "No"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
