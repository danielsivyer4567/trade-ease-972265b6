
import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Customers = () => {
  const navigate = useNavigate();
  
  // Mock customer data
  const customers = [
    { id: '1', name: 'John Smith', company: 'Smith Construction', email: 'john@smithconstruction.com', phone: '555-123-4567' },
    { id: '2', name: 'Jane Doe', company: 'Doe Builders', email: 'jane@doebuilders.com', phone: '555-987-6543' },
    { id: '3', name: 'Robert Johnson', company: 'Johnson Homes', email: 'robert@johnsonhomes.com', phone: '555-456-7890' },
  ];
  
  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Customers</h1>
          <Button onClick={() => navigate('/customers/new')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Customer
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="pl-10 pr-4 py-2 w-full border rounded-md"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map(customer => (
            <Card key={customer.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                  onClick={() => navigate(`/customers/${customer.id}`)}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <div className="bg-primary text-white rounded-full p-2">
                    <User className="h-4 w-4" />
                  </div>
                  {customer.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>{customer.company}</p>
                  <p>{customer.email}</p>
                  <p>{customer.phone}</p>
                </div>
                <Button variant="outline" className="w-full mt-4">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {customers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">No customers found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first customer</p>
            <Button onClick={() => navigate('/customers/new')}>
              <Plus className="h-4 w-4 mr-2" /> Add Customer
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Customers;
