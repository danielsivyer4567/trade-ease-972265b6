import React, { useEffect, useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CustomerFormValues, useCustomers } from './hooks/useCustomers';
import { CustomerContactFields } from './components/CustomerContactFields';
import { AddressFields } from './components/AddressFields';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Customer form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid street address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(3, "Zip/Postal code is required")
});

export default function EditCustomer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateCustomer } = useCustomers();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<any>(null);

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

  // Fetch customer data when component loads
  useEffect(() => {
    async function fetchCustomerData() {
      if (!id) {
        setError("No customer ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Fetching customer data for ID:", id);
        
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          throw new Error("You must be logged in to edit customer details");
        }

        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error("Database error:", error);
          throw error;
        }

        if (!data) {
          throw new Error("Customer not found");
        }

        console.log("Customer data retrieved:", data);
        setCustomer(data);

        // Set form values
        form.reset({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipcode || ""
        });
        
        console.log("Form values set:", form.getValues());
      } catch (err: any) {
        console.error("Error fetching customer data:", err);
        setError(err.message || "Failed to load customer details");
        toast({
          title: "Error",
          description: err.message || "Failed to load customer details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomerData();
  }, [id, form, toast]);

  // Direct update function bypassing the hook
  const updateCustomerDirectly = async (customerData: any) => {
    try {
      setIsSaving(true);
      console.log("Updating customer directly:", customerData);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("You must be logged in to update customer details");
      }

      // Map zipCode to zipcode for the database
      const customerUpdate = {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        state: customerData.state,
        zipcode: customerData.zipCode
      };
      
      console.log("Sending update to database:", customerUpdate);
      
      const { data, error } = await supabase
        .from('customers')
        .update(customerUpdate)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error("Update error:", error);
        throw error;
      }
      
      console.log("Update successful, response:", data);
      
      toast({
        title: "Success",
        description: "Customer updated successfully"
      });
      
      // Navigate back to customer detail
      navigate(`/customers/${id}`);
      return true;
    } catch (err: any) {
      console.error("Error updating customer:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update customer",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!id) {
      toast({
        title: "Error",
        description: "Customer ID is required to update customer",
        variant: "destructive"
      });
      return;
    }

    console.log("Form submitted with data:", data);
    setIsSaving(true);
    
    try {
      // First try with the hook
      const customerData: CustomerFormValues = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode
      };

      const result = await updateCustomer(id, customerData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Customer updated successfully"
        });
        navigate(`/customers/${id}`);
      } else {
        // If hook fails, try direct update
        console.log("Hook update failed, trying direct update");
        await updateCustomerDirectly(data);
      }
    } catch (err) {
      console.error("Error in submission:", err);
      // If any error, try direct update
      await updateCustomerDirectly(data);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Loading customer data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Link to="/customers" className="hover:text-blue-500">
              <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold">Edit Customer</h1>
          </div>

          <Card className="p-8 text-center">
            <h2 className="text-red-500 font-bold text-lg mb-2">Error Loading Customer</h2>
            <p className="mb-4">{error}</p>
            <Button onClick={() => navigate("/customers")}>Return to Customers</Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link to={`/customers/${id}`} className="hover:text-blue-500">
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold">Edit Customer</h1>
        </div>

        <Card className="p-4 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CustomerContactFields form={form} />
              
              <AddressFields form={form} />
              
              <div className="flex gap-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(`/customers/${id}`)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving || (!form.formState.isDirty && !form.formState.isSubmitting)}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
} 