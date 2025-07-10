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
import { ModernCustomerTable } from "./ModernCustomerTable";
import { CustomerTabs } from "./CustomerTabs";
import { CustomerActionToolbar } from "./CustomerActionToolbar";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  zipCode: z.string().optional().or(z.literal(""))
});

// Mock customer data for fallback
const MOCK_CUSTOMERS: CustomerData[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "0412 345 678",
    address: "123 Main St",
    city: "Brisbane",
    state: "QLD",
    zipCode: "4000",
    status: "active"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "0423 456 789",
    address: "456 High St",
    city: "Gold Coast",
    state: "QLD",
    zipCode: "4217",
    status: "active"
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "0434 567 890",
    address: "789 Beach Rd",
    city: "Sunshine Coast",
    state: "QLD",
    zipCode: "4575",
    status: "inactive"
  }
];

export function CustomersPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [apiCustomers, setApiCustomers] = useState<CustomerData[]>([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [useFallbackData, setUseFallbackData] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customers, isLoading, fetchCustomers, updateCustomer } = useCustomers();
  
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
    try {
      fetchCustomers().catch(error => {
        console.error("Error in fetchCustomers:", error);
        setUseFallbackData(true);
      });
      fetchApiCustomers();
    } catch (error) {
      console.error("Error initializing customer data:", error);
      setUseFallbackData(true);
    }
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
      // Don't show toast as it might be annoying, just silently fail
      // and use fallback data
      setUseFallbackData(true);
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

  // Use fallback data if both API and Supabase fail
  const customerData = useFallbackData ? MOCK_CUSTOMERS : (
    // Combine customers from both sources, prioritizing API customers
    [...(Array.isArray(apiCustomers) ? apiCustomers : []), ...customers.filter(
      customer => !(Array.isArray(apiCustomers) && apiCustomers.some(apiCustomer => apiCustomer.id === customer.id))
    )]
  );

  const filteredCustomers = customerData.filter(customer => {
    // Add null checks for all properties
    const customerName = customer?.name || '';
    const customerEmail = customer?.email || '';
    const customerPhone = customer?.phone || '';
    
    const matchesSearch = 
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) || 
      customerPhone.includes(searchQuery);
      
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
    if (!selectedCustomer) return;

    try {
      // Ensure all required fields are present
      const customerData = {
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        zipCode: data.zipCode || ""
      };

      const result = await updateCustomer(selectedCustomer.id, customerData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Customer updated successfully"
        });
        setEditModalOpen(false);
      } else {
        throw new Error("Failed to update customer");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Navigation Tabs */}
      <CustomerTabs />
      
      {/* Action Toolbar */}
      <CustomerActionToolbar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        filteredCustomers={filteredCustomers}
        handleFileUpload={handleFileUpload}
      />
      
      {/* Modern Table View */}
      <ModernCustomerTable 
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
