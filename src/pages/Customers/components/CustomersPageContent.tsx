
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Phone, Mail, MapPin, UserPlus, Upload, ArrowLeft, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCustomers } from "../hooks/useCustomers";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CustomerContactFields } from "./CustomerContactFields";
import { AddressFields } from "./AddressFields";
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

export function CustomersPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customers, isLoading, fetchCustomers } = useCustomers();
  
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "File received",
        description: `Processing ${file.name}. This feature is coming soon!`
      });
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         customer.phone.includes(searchQuery);
    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && customer.status === selectedFilter;
  });

  const handleCustomerClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };
  
  const handleEditClick = (e: React.MouseEvent, customer: any) => {
    e.stopPropagation();
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
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="rounded-md border border-gray-300 px-3 py-1 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-gray-950">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <User className="h-8 w-8" />
              Customers
            </h1>
          </div>
          <div className="flex gap-2 bg-slate-200">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Import Customers</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.csv';
                  input.onchange = e => handleFileUpload(e as any);
                  input.click();
                }}>
                  Import from CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.xlsx,.xls';
                  input.onchange = e => handleFileUpload(e as any);
                  input.click();
                }}>
                  Import from Spreadsheet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({
                  title: "Google Docs Import",
                  description: "Google Docs integration coming soon!"
                })}>
                  Import from Google Docs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => navigate('/customers/new')} className="text-zinc-950 bg-slate-400 hover:bg-slate-300">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>
        
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search customers by name, email, or phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-slate-200" />
          </div>
          <div className="flex gap-2">
            <Button variant={selectedFilter === "all" ? "default" : "outline"} onClick={() => setSelectedFilter("all")} className="bg-slate-400 hover:bg-slate-300">
              All
            </Button>
            <Button variant={selectedFilter === "active" ? "default" : "outline"} onClick={() => setSelectedFilter("active")} className="bg-slate-400 hover:bg-slate-300">
              Active
            </Button>
            <Button variant={selectedFilter === "inactive" ? "default" : "outline"} onClick={() => setSelectedFilter("inactive")} className="bg-slate-400 hover:bg-slate-300">
              Inactive
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p className="text-gray-500">Loading customers...</p>
        </div>
      ) : filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredCustomers.map(customer => (
            <Card 
              key={customer.id} 
              className="hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleCustomerClick(customer.id)}
            >
              <CardHeader className="py-3 bg-slate-200">
                <CardTitle className="text-lg flex items-center justify-between text-slate-950">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="cursor-pointer hover:text-blue-600 hover:underline">{customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{customer.status === 'active' ? 'Active' : 'Inactive'}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => handleEditClick(e, customer)}
                      className="ml-2 p-1"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {customer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {customer.address}, {customer.city}, {customer.state} {customer.zipCode}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex justify-center py-8">
          <p className="text-gray-500">
            {searchQuery ? `No customers found matching '${searchQuery}'` : "No customers yet. Add your first customer!"}
          </p>
        </div>
      )}
      
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md bg-slate-50 border-0">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <CustomerContactFields form={form} className="mt-2" />
              <AddressFields form={form} className="mt-4" />

              <DialogFooter className="mt-6">
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
    </div>
  );
}
