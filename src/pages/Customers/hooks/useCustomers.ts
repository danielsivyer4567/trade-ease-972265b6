import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

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
  customer_code?: string;
  business_name?: string;
  abn?: string;
  acn?: string;
  state_licence_state?: string;
  state_licence_number?: string;
  national_certifications?: string[];
  certification_details?: Record<string, string>;
}

export type CustomerFormValues = Omit<Customer, 'id' | 'status' | 'created_at' | 'user_id'>;

export function useCustomers() {
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching customers from Supabase...');
      const { data: session } = await supabase.auth.getSession();
      
      // Debug auth session
      console.log('Auth session:', session ? 'Found' : 'Not found');
      
      if (!session?.session?.user) {
        const errMsg = "Authentication Error: You must be logged in to view customers";
        console.error(errMsg);
        setError(errMsg);
        uiToast({
          title: "Authentication Error",
          description: "You must be logged in to view customers",
          variant: "destructive"
        });
        return [];
      }

      console.log('Querying customers table with user_id:', session.session.user.id);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('name');

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log(`Retrieved ${data?.length || 0} customers from database`);
      
      // Map database fields to our interface format
      const formattedData = (data || []).map(customer => ({
        ...customer,
        zipCode: customer.zipcode, // Map zipcode from DB to zipCode in our interface
        business_name: customer.business_name || undefined,
        abn: customer.abn || undefined,
        acn: customer.acn || undefined,
        state_licence_state: customer.state_licence_state || undefined,
        state_licence_number: customer.state_licence_number || undefined,
        national_certifications: customer.national_certifications || undefined,
        certification_details: customer.certification_details || undefined
      }));

      setCustomers(formattedData);
      return formattedData;
    } catch (error: any) {
      const errMsg = error.message || "An unexpected error occurred";
      console.error("Exception fetching customers:", error);
      setError(errMsg);
      
      // Check for specific database errors
      if (error.code === '42P01') {
        console.error("Table 'customers' does not exist. Please ensure the database is properly set up.");
        uiToast({
          title: "Database Error",
          description: "The customers table does not exist. Database setup may be required.",
          variant: "destructive"
        });
      } else {
        uiToast({
          title: "Error",
          description: errMsg,
          variant: "destructive"
        });
      }
      
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [uiToast]);

  // Load customers on mount
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const createCustomer = async (customerData: CustomerFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        const errMsg = "Authentication Error: You must be logged in to create a customer";
        setError(errMsg);
        uiToast({
          title: "Authentication Error",
          description: errMsg,
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
        user_id: session.session.user.id,
        business_name: customerData.business_name,
        abn: customerData.abn,
        acn: customerData.acn,
        state_licence_state: customerData.state_licence_state,
        state_licence_number: customerData.state_licence_number,
        national_certifications: customerData.national_certifications,
        certification_details: customerData.certification_details
      };
      
      console.log("Transformed data for Supabase:", customerWithUserId);
      
      const { data, error } = await supabase
        .from('customers')
        .insert(customerWithUserId)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success("Customer created successfully");
      
      // Map the returned data to match our interface, ensuring zipCode is properly set
      const formattedData = {
        ...data,
        zipCode: data.zipcode,
        business_name: data.business_name || undefined,
        abn: data.abn || undefined,
        acn: data.acn || undefined,
        state_licence_state: data.state_licence_state || undefined,
        state_licence_number: data.state_licence_number || undefined,
        national_certifications: data.national_certifications || undefined,
        certification_details: data.certification_details || undefined
      };
      
      // Update the local customer list with the new customer
      setCustomers(prev => [...prev, formattedData]);
      
      return { success: true, data: formattedData };
    } catch (error: any) {
      const errMsg = error.message || "An unexpected error occurred";
      setError(errMsg);
      console.error("Exception creating customer:", error);
      uiToast({
        title: "Error",
        description: errMsg,
        variant: "destructive"
      });
      return { success: false, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const updateCustomer = async (id: string, customerData: CustomerFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        const errMsg = "Authentication Error: You must be logged in to update a customer";
        setError(errMsg);
        uiToast({
          title: "Authentication Error",
          description: errMsg,
          variant: "destructive"
        });
        return { success: false, data: null };
      }
      
      // Map zipCode to zipcode for the database
      const customerUpdate = {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        state: customerData.state,
        zipcode: customerData.zipCode,
        business_name: customerData.business_name,
        abn: customerData.abn,
        acn: customerData.acn,
        state_licence_state: customerData.state_licence_state,
        state_licence_number: customerData.state_licence_number,
        national_certifications: customerData.national_certifications,
        certification_details: customerData.certification_details
      };
      
      const { data, error } = await supabase
        .from('customers')
        .update(customerUpdate)
        .eq('id', id)
        .eq('user_id', session.session.user.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success("Customer updated successfully");
      
      // Map the returned data to match our interface
      const formattedData = {
        ...data,
        zipCode: data.zipcode,
        business_name: data.business_name || undefined,
        abn: data.abn || undefined,
        acn: data.acn || undefined,
        state_licence_state: data.state_licence_state || undefined,
        state_licence_number: data.state_licence_number || undefined,
        national_certifications: data.national_certifications || undefined,
        certification_details: data.certification_details || undefined
      };
      
      // Update the local customer list
      setCustomers(prev => prev.map(customer => 
        customer.id === id ? formattedData : customer
      ));
      
      return { success: true, data: formattedData };
    } catch (error: any) {
      const errMsg = error.message || "An unexpected error occurred";
      setError(errMsg);
      console.error("Exception updating customer:", error);
      uiToast({
        title: "Error",
        description: errMsg,
        variant: "destructive"
      });
      return { success: false, data: null };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        const errMsg = "Authentication Error: You must be logged in to delete a customer";
        setError(errMsg);
        uiToast({
          title: "Authentication Error",
          description: errMsg,
          variant: "destructive"
        });
        return { success: false };
      }
      
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)
        .eq('user_id', session.session.user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Customer deleted successfully");
      
      // Update the local customer list
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      
      return { success: true };
    } catch (error: any) {
      const errMsg = error.message || "An unexpected error occurred";
      setError(errMsg);
      console.error("Exception deleting customer:", error);
      uiToast({
        title: "Error",
        description: errMsg,
        variant: "destructive"
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    customers,
    isLoading,
    error,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
  };
}
