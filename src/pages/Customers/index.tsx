
import { AppLayout } from "@/components/ui/AppLayout";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, Edit, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCustomers } from "./hooks/useCustomers";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CustomerContactFields } from "./components/CustomerContactFields";
import { AddressFields } from "./components/AddressFields";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  zipCode: z.string().optional().or(z.literal(""))
});

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { customers, fetchCustomers, isLoading } = useCustomers();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: ""
    }
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );
  
  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    form.reset({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode
    });
    setEditModalOpen(true);
  };

  const handleViewDetails = (customerId) => {
    navigate(`/customers/${customerId}`);
  };
  
  const handleAddCustomer = () => {
    navigate('/customers/new');
  };

  const onSubmit = async (data) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to update customer information",
          variant: "destructive"
        });
        return;
      }

      const customerData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipcode: data.zipCode
      };

      const { error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', selectedCustomer.id);

      if (error) {
        console.error("Error updating customer:", error);
        toast({
          title: "Error",
          description: "Failed to update customer information",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Customer information updated successfully"
      });
      
      setEditModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Exception updating customer:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Customers</h1>
          <Button onClick={handleAddCustomer} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Customer
          </Button>
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
              <div className="grid grid-cols-5 gap-4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>Name</div>
                <div>Email</div>
                <div>Phone</div>
                <div>Address</div>
                <div>Actions</div>
              </div>
            </div>
            <div className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <div className="px-6 py-4 text-center text-gray-500">
                  Loading customers...
                </div>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <div key={customer.id} className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-gray-50">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {customer.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {customer.phone}
                    </div>
                    <div className="text-sm text-gray-500">{customer.address}, {customer.city}, {customer.state} {customer.zipCode}</div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(customer.id)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditClick(customer)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
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

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CustomerContactFields form={form} />
              <AddressFields form={form} />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
