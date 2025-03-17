
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CustomerFormValues, useCustomers } from './hooks/useCustomers';
import { CustomerContactFields } from './components/CustomerContactFields';
import { AddressFields } from './components/AddressFields';
import { FormActions } from './components/FormActions';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid street address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(3, "Zip/Postal code is required")
});

export default function NewCustomer() {
  const navigate = useNavigate();
  const { createCustomer } = useCustomers();

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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Submitting customer data:", data);
    
    const customerData: CustomerFormValues = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode
    };

    const result = await createCustomer(customerData);
    if (result.success) {
      navigate("/customers");
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/customers" className="hover:text-blue-500">
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold">Add New Customer</h1>
        </div>

        <Card className="p-4 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CustomerContactFields form={form} />
              
              <AddressFields form={form} />
              
              <FormActions 
                isSubmitting={form.formState.isSubmitting}
                onCancel={() => navigate("/customers")}
              />
            </form>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
