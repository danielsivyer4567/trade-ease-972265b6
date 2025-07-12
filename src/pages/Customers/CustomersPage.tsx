import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink } from 'lucide-react';
import { useCustomers, Customer } from './hooks/useCustomers';

export default function CustomersPage() {
  const navigate = useNavigate();
  const { customers, isLoading, error } = useCustomers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Add mock progress property for existing customers
  const customersWithProgress = useMemo(() => 
    customers.map(customer => ({
      ...customer,
      progress: Math.floor(Math.random() * 100), // Mock progress value
      jobTitle: customer.business_name || 'Customer' // Mock job title
    })), [customers]
  );

  const filteredAndSortedCustomers = useMemo(() => {
    return customersWithProgress
      .filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            customer.phone.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [customersWithProgress, searchTerm, statusFilter]);

  if (error) {
    return (
      <BaseLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            Error loading customers: {error}
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Customers</h1>
          <Button onClick={() => navigate('/customers/new')}>
            Add New Customer
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left: Customer List */}
          <div className="col-span-12 md:col-span-3 bg-white rounded-lg shadow-md flex flex-col h-[80vh]">
            {/* Sticky header for search/filters */}
            <div className="sticky top-0 z-10 bg-white p-4 border-b flex flex-col gap-2">
              <Input
                type="text"
                placeholder="Search customers by name, email, ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
              <div className="flex gap-2">
                <Button size="sm" variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>All</Button>
                <Button size="sm" variant={statusFilter === 'active' ? 'default' : 'outline'} onClick={() => setStatusFilter('active')}>Active</Button>
                <Button size="sm" variant={statusFilter === 'inactive' ? 'default' : 'outline'} onClick={() => setStatusFilter('inactive')}>Inactive</Button>
              </div>
            </div>
            {/* Customer cards list */}
            <div className="overflow-y-auto flex-1 p-2">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading customers...</p>
                </div>
              ) : filteredAndSortedCustomers.length > 0 ? (
                filteredAndSortedCustomers.map((customer) => (
                  <Card 
                    key={customer.id}
                    className={`mb-1 cursor-pointer hover:shadow transition-shadow ${selectedCustomer?.id === customer.id ? 'border-2 border-primary ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    <CardContent className="p-2">
                      <div className="flex justify-between items-center mb-1">
                        <div>
                          <h3 className="font-medium cursor-pointer hover:text-blue-600 hover:underline text-sm">{customer.name}</h3>
                          <p className="text-xs text-muted-foreground">{customer.jobTitle}</p>
                        </div>
                        {customer.status === 'active' && (
                          <Button 
                            variant="default"
                            size="sm"
                            className="flex items-center gap-1 ml-2 h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/customers/${customer.id}`);
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Open</span>
                          </Button>
                        )}
                      </div>
                      <Progress value={customer.progress} className="h-1 mb-1" />
                      <div className="text-xs text-gray-500 truncate">{customer.email}</div>
                      <div className="text-xs text-gray-500 truncate">{customer.phone}</div>
                      <div className="text-xs text-gray-500 truncate">{customer.address}</div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-muted rounded-lg">
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No customers match your search criteria.' 
                      : 'No customers found.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Center: Tabs and Details */}
          <div className="col-span-12 md:col-span-6 flex flex-col h-[80vh] bg-white rounded-lg shadow-md">
            <Tabs defaultValue="communications" className="flex-1 flex flex-col">
              <TabsList className="flex gap-4 p-4 border-b bg-white sticky top-0 z-10">
                <TabsTrigger value="communications">Communications</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="communications" className="flex-1 overflow-y-auto p-4">
                {selectedCustomer ? (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh]">Communications content goes here.</div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh] flex items-center justify-center text-gray-400">Select a customer to view communications.</div>
                )}
              </TabsContent>
              <TabsContent value="quotes" className="flex-1 overflow-y-auto p-4">
                {selectedCustomer ? (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh]">Quotes content goes here.</div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh] flex items-center justify-center text-gray-400">Select a customer to view quotes.</div>
                )}
              </TabsContent>
              <TabsContent value="jobs" className="flex-1 overflow-y-auto p-4">
                {selectedCustomer ? (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh]">Jobs content goes here.</div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh] flex items-center justify-center text-gray-400">Select a customer to view jobs.</div>
                )}
              </TabsContent>
              <TabsContent value="documents" className="flex-1 overflow-y-auto p-4">
                {selectedCustomer ? (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh]">Documents content goes here.</div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh] flex items-center justify-center text-gray-400">Select a customer to view documents.</div>
                )}
              </TabsContent>
              <TabsContent value="notes" className="flex-1 overflow-y-auto p-4">
                {selectedCustomer ? (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh]">Notes content goes here.</div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 min-h-[60vh] flex items-center justify-center text-gray-400">Select a customer to view notes.</div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Journey/Progress */}
          <div className="col-span-12 md:col-span-3 flex flex-col h-[80vh] bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Job Journey</h3>
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
              {selectedCustomer ? (
                <span className="text-gray-700">Journey/Progress tracker goes here.</span>
              ) : (
                <span className="text-gray-400">Select a customer to view their journey/progress.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}