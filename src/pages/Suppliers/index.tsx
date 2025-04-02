
import React, { useState } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Truck, Building, PhoneCall, Mail, Filter, SlidersHorizontal } from "lucide-react";

// Define supplier types
interface Supplier {
  id: string;
  name: string;
  type: 'material' | 'service' | 'equipment';
  contact: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
  lastOrder?: string;
}

// Sample suppliers data
const sampleSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Smith Building Materials',
    type: 'material',
    contact: 'John Smith',
    phone: '(555) 123-4567',
    email: 'john@smithbm.com',
    address: '123 Commerce St, Portland, OR',
    status: 'active',
    lastOrder: '2023-05-15',
  },
  {
    id: '2',
    name: 'Johnson Equipment Rental',
    type: 'equipment',
    contact: 'Sarah Johnson',
    phone: '(555) 987-6543',
    email: 'sarah@johnsonequip.com',
    address: '456 Industrial Ave, Seattle, WA',
    status: 'active',
    lastOrder: '2023-04-22',
  },
  {
    id: '3',
    name: 'AAA Electrical Services',
    type: 'service',
    contact: 'Mike Davis',
    phone: '(555) 234-5678',
    email: 'mike@aaaelectrical.com',
    address: '789 Main St, Tacoma, WA',
    status: 'inactive',
    lastOrder: '2022-11-30',
  },
  {
    id: '4',
    name: 'Northwest Lumber Co.',
    type: 'material',
    contact: 'Lisa West',
    phone: '(555) 345-6789',
    email: 'lisa@nwlumber.com',
    address: '321 Forest Rd, Vancouver, WA',
    status: 'active',
    lastOrder: '2023-05-03',
  },
  {
    id: '5',
    name: 'Quality Plumbing Supplies',
    type: 'material',
    contact: 'Robert Chen',
    phone: '(555) 456-7890',
    email: 'robert@qualityplumbing.com',
    address: '654 Water Way, Portland, OR',
    status: 'active',
    lastOrder: '2023-04-28',
  },
];

const SuppliersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers] = useState<Supplier[]>(sampleSuppliers);
  const [activeTab, setActiveTab] = useState('all');

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && supplier.status === 'active';
    if (activeTab === 'inactive') return matchesSearch && supplier.status === 'inactive';
    if (activeTab === 'materials') return matchesSearch && supplier.type === 'material';
    if (activeTab === 'equipment') return matchesSearch && supplier.type === 'equipment';
    if (activeTab === 'services') return matchesSearch && supplier.type === 'service';
    
    return matchesSearch;
  });

  return (
    <BaseLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Truck className="mr-2 h-6 w-6 text-primary" />
              Suppliers
            </h1>
            <p className="text-muted-foreground">Manage your supplier relationships and orders</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Supplier
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Supplier Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="equipment">Equipment</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <SupplierTable suppliers={filteredSuppliers} />
              </TabsContent>
              <TabsContent value="active" className="mt-0">
                <SupplierTable suppliers={filteredSuppliers} />
              </TabsContent>
              <TabsContent value="materials" className="mt-0">
                <SupplierTable suppliers={filteredSuppliers} />
              </TabsContent>
              <TabsContent value="equipment" className="mt-0">
                <SupplierTable suppliers={filteredSuppliers} />
              </TabsContent>
              <TabsContent value="services" className="mt-0">
                <SupplierTable suppliers={filteredSuppliers} />
              </TabsContent>
              <TabsContent value="inactive" className="mt-0">
                <SupplierTable suppliers={filteredSuppliers} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
};

interface SupplierTableProps {
  suppliers: Supplier[];
}

const SupplierTable = ({ suppliers }: SupplierTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead className="hidden lg:table-cell">Email/Phone</TableHead>
            <TableHead className="hidden xl:table-cell">Last Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <p className="text-muted-foreground">No suppliers found</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-1" />
                  Add a supplier
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>
                  <div className="font-medium">{supplier.name}</div>
                  <div className="text-sm text-muted-foreground md:hidden">{supplier.contact}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {supplier.type === 'material' && <Building className="h-4 w-4 text-blue-500" />}
                    {supplier.type === 'equipment' && <Truck className="h-4 w-4 text-green-500" />}
                    {supplier.type === 'service' && <Truck className="h-4 w-4 text-purple-500" />}
                    <span className="capitalize">{supplier.type}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{supplier.contact}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      {supplier.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <PhoneCall className="h-3 w-3 text-muted-foreground" />
                      {supplier.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {supplier.lastOrder ? (
                    new Date(supplier.lastOrder).toLocaleDateString()
                  ) : (
                    <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    supplier.status === 'active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {supplier.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <svg width="15" height="3" viewBox="0 0 15 3" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                      <path d="M1.5 3C2.32843 3 3 2.32843 3 1.5C3 0.671573 2.32843 0 1.5 0C0.671573 0 0 0.671573 0 1.5C0 2.32843 0.671573 3 1.5 3Z" fill="currentColor" />
                      <path d="M7.5 3C8.32843 3 9 2.32843 9 1.5C9 0.671573 8.32843 0 7.5 0C6.67157 0 6 0.671573 6 1.5C6 2.32843 6.67157 3 7.5 3Z" fill="currentColor" />
                      <path d="M13.5 3C14.3284 3 15 2.32843 15 1.5C15 0.671573 14.3284 0 13.5 0C12.6716 0 12 0.671573 12 1.5C12 2.32843 12.6716 3 13.5 3Z" fill="currentColor" />
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SuppliersPage;
