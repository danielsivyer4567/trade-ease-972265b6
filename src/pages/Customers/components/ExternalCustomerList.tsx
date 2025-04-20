import React, { useState, useEffect } from 'react';
import { fetchCustomersFromAPI, openCustomer } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function ExternalCustomerList() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCustomersFromAPI();
        setCustomers(data);
        if (data.length > 0) {
          setSelectedCustomer(data[0]);
        }
      } catch (error) {
        console.error('Failed to load customers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const handleCustomerClick = (customer: any) => {
    setSelectedCustomer(customer);
  };

  const handleOpenClick = async (customerId: string) => {
    try {
      await openCustomer(customerId);
    } catch (error) {
      console.error('Error opening customer:', error);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
        <div className="flex gap-2">
          <Button variant="outline">Add Customer</Button>
          <Button>New Job</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left panel - customer list */}
        <div className="col-span-1">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search customers..."
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">Name</div>
            <div className="flex gap-4">
              <div className="text-sm font-medium">Progress</div>
              <div className="text-sm font-medium">Status</div>
            </div>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[70vh]">
            {isLoading ? (
              <div className="text-center py-4">Loading customers...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-4">No customers found</div>
            ) : (
              filteredCustomers.map(customer => (
                <Card
                  key={customer.id}
                  className={`cursor-pointer transition-all ${
                    selectedCustomer?.id === customer.id ? 'border-primary' : ''
                  }`}
                  onClick={() => handleCustomerClick(customer)}
                >
                  <div className="p-3 bg-slate-300 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{customer.name}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-2 py-1 h-7 text-xs ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenClick(customer.id);
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                    </div>
                    <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                      {customer.status}
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-2">{customer.jobTitle || 'No job'}</div>
                    <Progress value={customer.progress || 0} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Job Progress: {customer.progress || 0}%</span>
                      <span>Last Contact: {customer.lastContact || 'N/A'}</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right panel - customer details */}
        <div className="col-span-2">
          {selectedCustomer ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
                <Badge variant={selectedCustomer.status === 'active' ? 'default' : 'secondary'}>
                  {selectedCustomer.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div>{selectedCustomer.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div>{selectedCustomer.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Address</div>
                  <div>{selectedCustomer.address}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Customer since</div>
                  <div>January 2023</div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Customer Progress Link</h3>
                <div className="p-2 border rounded-md bg-slate-50">
                  <p className="text-sm text-gray-500 mb-2">
                    Share this link with your customer to keep them updated on job progress
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="truncate flex-1 text-sm">
                      https://example.com/progress/{selectedCustomer.id}
                    </div>
                    <Button variant="outline" size="sm">
                      Copy
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Progress Portal Preview</h3>
                <div className="border rounded-md p-4">
                  <Tabs defaultValue="progress">
                    <TabsList>
                      <TabsTrigger value="progress">Progress</TabsTrigger>
                      <TabsTrigger value="photos">Photos</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                      <TabsTrigger value="comments">Comments</TabsTrigger>
                    </TabsList>
                    <TabsContent value="progress" className="space-y-4 mt-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Progress: 6 of 10 steps completed</span>
                          <span>60%</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a customer to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 