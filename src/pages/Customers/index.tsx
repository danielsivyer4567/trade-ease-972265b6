
import { AppLayout } from "@/components/ui/AppLayout";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone } from "lucide-react";
import { useState } from "react";

// Mock customer data - in a real app, this would come from your backend
const mockCustomers = [
  { id: 1, name: "John Smith", email: "john@example.com", phone: "+1 234-567-8901", address: "123 Main St" },
  { id: 2, name: "Sarah Johnson", email: "sarah@example.com", phone: "+1 234-567-8902", address: "456 Oak Ave" },
  { id: 3, name: "Michael Brown", email: "michael@example.com", phone: "+1 234-567-8903", address: "789 Pine Rd" },
  // Add more mock customers as needed
];

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Customers</h1>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            <div className="bg-gray-50">
              <div className="grid grid-cols-4 gap-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>Name</div>
                <div>Email</div>
                <div>Phone</div>
                <div>Address</div>
              </div>
            </div>
            <div className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <div key={customer.id} className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {customer.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {customer.phone}
                    </div>
                    <div className="text-sm text-gray-500">{customer.address}</div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-4 text-center text-gray-500">
                  No customers found matching '{searchQuery}'
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
