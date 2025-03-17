
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'active' | 'inactive';
  created_at: string;
  user_id: string;
}

export type CustomerFormValues = Omit<Customer, 'id' | 'status' | 'created_at' | 'user_id'>;

export function useCustomers() {
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { toast } = useToast();

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to view customers",
          variant: "destructive"
        });
        return [];
      }

      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('name');

      if (error) {
        console.error("Error fetching customers:", error);
        toast({
          title: "Error",
          description: "Failed to load customers",
          variant: "destructive"
        });
        return [];
      }

      // Map database fields to our interface format
      const formattedData = data.map(customer => ({
        ...customer,
        zipCode: customer.zipcode // Map zipcode from DB to zipCode in our interface
      }));

      setCustomers(formattedData);
      return formattedData;
    } catch (error: any) {
      console.error("Exception fetching customers:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const createCustomer = async (customerData: CustomerFormValues) => {
    setIsLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create a customer",
          variant: "destructive"
        });
        return { success: false, data: null };
      }
      
      console.log("Customer data being submitted:", customerData);
      
      // Add user_id and status to the customer data
      // Also map zipCode to zipcode for the database
      const customerWithUserId = {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        state: customerData.state,
        zipcode: customerData.zipCode, // Explicitly map zipCode to zipcode for DB
        status: 'active',
        user_id: session.session.user.id
      };
      
      console.log("Transformed data for Supabase:", customerWithUserId);
      
      const { data, error } = await supabase
        .from('customers')
        .insert(customerWithUserId)
        .select()
        .single();
      
      if (error) {
        console.error("Error creating customer:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to create customer",
          variant: "destructive"
        });
        return { success: false, data: null };
      }
      
      toast({
        title: "Success",
        description: "Customer created successfully"
      });
      
      // Map the returned data to match our interface, ensuring zipCode is properly set
      const formattedData = {
        ...data,
        zipCode: data.zipcode
      };
      
      console.log("Formatted data after creation:", formattedData);
      
      return { success: true, data: formattedData };
    } catch (error: any) {
      console.error("Exception creating customer:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return { success: false, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    customers,
    isLoading,
    fetchCustomers,
    createCustomer
  };
}
