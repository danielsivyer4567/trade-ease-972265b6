
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Search, Plus, Filter, FileDown, FileUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  reorderPoint: number;
  unitCost: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const InventoryPage = () => {
  // Sample inventory data - in a real app, this would be fetched from your database
  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Timber Planks (2x4)',
      sku: 'TP-2X4-10',
      category: 'Lumber',
      quantity: 48,
      reorderPoint: 20,
      unitCost: 8.50,
      status: 'in-stock'
    },
    {
      id: '2',
      name: 'Galvanized Screws (2")',
      sku: 'GS-2IN-500',
      category: 'Fasteners',
      quantity: 1200,
      reorderPoint: 500,
      unitCost: 0.15,
      status: 'in-stock'
    },
    {
      id: '3',
      name: 'PVC Pipe (1" x 10\')',
      sku: 'PVC-1IN-10',
      category: 'Plumbing',
      quantity: 12,
      reorderPoint: 15,
      unitCost: 9.99,
      status: 'low-stock'
    },
    {
      id: '4',
      name: 'Concrete Mix (50lb)',
      sku: 'CM-50LB',
      category: 'Building Materials',
      quantity: 0,
      reorderPoint: 10,
      unitCost: 15.75,
      status: 'out-of-stock'
    },
    {
      id: '5',
      name: 'Door Knob Set (Bronze)',
      sku: 'DK-BRZ',
      category: 'Hardware',
      quantity: 8,
      reorderPoint: 5,
      unitCost: 24.99,
      status: 'in-stock'
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>;
      case 'low-stock':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Inventory Management</h1>
              <p className="text-gray-500">Manage your stock, materials, and equipment</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventoryItems.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Low Stock Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {inventoryItems.filter(item => item.status === 'low-stock').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Out of Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {inventoryItems.filter(item => item.status === 'out-of-stock').length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Inventory Items</CardTitle>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search items..."
                      className="pl-8 w-full sm:w-[250px]"
                    />
                  </div>
                  
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="icon">
                    <FileDown className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="icon">
                    <FileUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Cost</TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems.map((item) => (
                      <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitCost)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.quantity * item.unitCost)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
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

export default InventoryPage;
