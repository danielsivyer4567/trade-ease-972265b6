import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCustomers } from "../hooks/useCustomers";
import { supabase } from "@/integrations/supabase/client";
import { CustomerHeader } from "./CustomerHeader";
import { CustomerSearchBar } from "./CustomerSearchBar";
import { CustomerList } from "./CustomerList";
import { CustomerEditModal } from "./CustomerEditModal";
import { CustomerData } from "./CustomerCard";
import { fetchCustomersFromAPI } from "@/services/api";

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
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [apiCustomers, setApiCustomers] = useState<CustomerData[]>([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
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
  
  // Fetch customers from both sources
  useEffect(() => {
    fetchCustomers();
    fetchApiCustomers();
  }, [fetchCustomers]);
  
  // Function to fetch customers from API
  const fetchApiCustomers = async () => {
    setIsApiLoading(true);
    setApiError(null);
    try {
      const data = await fetchCustomersFromAPI();
      setApiCustomers(data);
    } catch (error) {
      console.error("Error fetching customers from API:", error);
      setApiError("Failed to fetch customers from external API");
      toast({
        title: "API Error",
        description: "Failed to fetch customers from external API",
        variant: "destructive"
      });
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "File received",
        description: `Processing ${file.name}. This feature is coming soon!`
      });
    }
  };

  // Combine customers from both sources, prioritizing API customers
  const allCustomers = [...apiCustomers, ...customers.filter(
    customer => !apiCustomers.some(apiCustomer => apiCustomer.id === customer.id)
  )];

  const filteredCustomers = allCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         customer.phone.includes(searchQuery);
    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && customer.status === selectedFilter;
  });

  const handleCustomerClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };
  
  const handleEditClick = (e: React.MouseEvent, customer: CustomerData) => {
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

      if (!selectedCustomer) {
        toast({
          title: "Error",
          description: "No customer selected for update",
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
      fetchApiCustomers(); // Refresh API customers as well
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
        <CustomerHeader 
          handleFileUpload={handleFileUpload} 
        />
        
        <CustomerSearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          filteredCustomers={filteredCustomers}
        />
      </div>

      <CustomerList 
        isLoading={isLoading || isApiLoading}
        filteredCustomers={filteredCustomers}
        searchQuery={searchQuery}
        onCustomerClick={handleCustomerClick}
        onEditClick={handleEditClick}
      />
      
      <CustomerEditModal 
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        form={form}
        onSubmit={onSubmit}
      />
    </div>
  );
}
