
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

      setCustomers(data || []);
      return data;
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
      
      // Add user_id and status to the customer data
      const customerWithUserId = {
        ...customerData,
        status: 'active',
        user_id: session.session.user.id
      };
      
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
      
      return { success: true, data };
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
