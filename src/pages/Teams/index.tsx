import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, User, Mail, Phone, MapPin } from 'lucide-react';
import { useCustomers } from '@/pages/Customers/hooks/useCustomers';

export default function Teams() {
  const { customers, isLoading, error, createCustomer } = useCustomers();
  const [isCreating, setIsCreating] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [newCustomerName, setNewCustomerName] = React.useState('');

  const handleCreateCustomer = async () => {
    if (newCustomerName.trim()) {
      await createCustomer({
        name: newCustomerName.trim(),
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        status: 'active',
      });
      setNewCustomerName('');
      setIsCreating(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="h-full flex flex-col max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex-shrink-0 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Customer
            </Button>
          </div>
          <p className="text-muted-foreground mt-2">
            Search, view, and manage your customers.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Input 
            placeholder="Search customers..." 
            className="pl-10 h-12 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && <p>Loading customers...</p>}
          {error && <p className="text-red-500">{error}</p>}
          
          <div className="space-y-4">
            {isCreating && (
              <Card className="p-4 border-dashed">
                <div className="flex gap-4 items-center">
                  <Input
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="New customer name"
                    className="flex-1"
                    autoFocus
                  />
                  <Button onClick={handleCreateCustomer}>Save</Button>
                  <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                </div>
              </Card>
            )}

            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                      <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{customer.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" />{customer.email}</span>
                        <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" />{customer.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {customer.address}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Status: <span className="font-medium text-green-600">{customer.status}</span>
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 