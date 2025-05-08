import React, { useEffect, useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
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
  emails: z.array(z.object({
    address: z.string().email("Invalid email address"),
    type: z.enum(["general", "general_and_quotes", "invoices"])
  })).min(1, "At least one email is required"),
  phone: z.string().min(5, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid street address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(3, "Zip/Postal code is required"),
  jobSiteAddresses: z.array(z.object({
    id: z.string().optional(),
    label: z.string().min(2, "Label must be at least 2 characters"),
    address: z.string().min(5, "Please enter a valid street address"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipcode: z.string().min(3, "Zip/Postal code is required"),
    is_default: z.boolean().optional()
  })).optional(),
  // Business details
  business_name: z.string().optional(),
  abn: z.string().optional(),
  acn: z.string().optional(),
  state_licence_state: z.string().optional(),
  state_licence_number: z.string().optional(),
  national_certifications: z.array(z.string()).optional()
});

export default function EditCustomer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateCustomer, deleteCustomer } = useCustomers();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      emails: [{ address: "", type: "general" }],
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      jobSiteAddresses: [],
      business_name: "",
      abn: "",
      acn: "",
      state_licence_state: "",
      state_licence_number: "",
      national_certifications: []
    }
  });

  const { control, register } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "jobSiteAddresses"
  });
  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
    control,
    name: "emails"
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

        // Fetch addresses
        const { data: addressesData, error: addressesError } = await supabase
          .from('customer_addresses')
          .select('*')
          .eq('customer_id', id);
        if (addressesError) {
          console.error("Error fetching addresses:", addressesError);
        }
        setAddresses(addressesData || []);

        // Set form values
        form.reset({
          name: data.name || "",
          emails: data.emails && data.emails.length > 0 ? data.emails : [{ address: data.email || "", type: "general" }],
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipcode || "",
          jobSiteAddresses: (addressesData || []).map(addr => ({
            id: addr.id,
            label: addr.label || "",
            address: addr.address || "",
            city: addr.city || "",
            state: addr.state || "",
            zipcode: addr.zipcode || "",
            is_default: addr.is_default || false
          })),
          business_name: data.business_name || "",
          abn: data.abn || "",
          acn: data.acn || "",
          state_licence_state: data.state_licence_state || "",
          state_licence_number: data.state_licence_number || "",
          national_certifications: data.national_certifications || []
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
        emails: customerData.emails,
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
      // Update customer main fields
const customerData: CustomerFormValues = {
  name: data.name,
  email: data.emails.map((email: any) => email.value).join(', '),
  phone: data.phone,
  address: data.address,
  city: data.city,
  state: data.state,
        zipCode: data.zipCode
      };
      const result = await updateCustomer(id, customerData);
      // Upsert job site addresses
      const { error: addrError } = await supabase
        .from('customer_addresses')
        .upsert(
          (data.jobSiteAddresses || []).map(addr => ({
            ...addr,
            customer_id: id,
            id: addr.id || undefined // let Supabase generate if new
          })),
          { onConflict: 'id' }
        );
      if (addrError) {
        throw addrError;
      }
      toast({
        title: "Success",
        description: "Customer and addresses updated successfully"
      });
      navigate(`/customers/${id}`);
    } catch (err: any) {
      console.error("Error in submission:", err);
      // If any error, try direct update
      await updateCustomerDirectly(data);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      const result = await deleteCustomer(id);
      if (result.success) {
        toast({ title: "Customer deleted", description: "The customer has been deleted." });
        navigate("/customers");
      } else {
        toast({ title: "Error", description: "Failed to delete customer.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete customer.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteInput("");
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
              
              {/* Job Site Addresses Section */}
              <div>
                <h3 className="text-lg font-medium mb-2">Job Site Addresses</h3>
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-2 border p-2 rounded mb-2">
                    <input {...register(`jobSiteAddresses.${index}.label`)} placeholder="Label" className="input" />
                    <input {...register(`jobSiteAddresses.${index}.address`)} placeholder="Address" className="input" />
                    <input {...register(`jobSiteAddresses.${index}.city`)} placeholder="City" className="input" />
                    <input {...register(`jobSiteAddresses.${index}.state`)} placeholder="State" className="input" />
                    <input {...register(`jobSiteAddresses.${index}.zipcode`)} placeholder="Zipcode" className="input" />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...register(`jobSiteAddresses.${index}.is_default`)}
                        checked={form.watch(`jobSiteAddresses.${index}.is_default`) || false}
                        onChange={() => {
                          const addresses = form.getValues('jobSiteAddresses');
                          addresses.forEach((addr, i) => {
                            form.setValue(`jobSiteAddresses.${i}.is_default`, i === index);
                          });
                        }}
                      />
                      Default job site address
                    </label>
                    <Button type="button" variant="destructive" onClick={() => remove(index)}>Remove</Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => append({ label: "", address: "", city: "", state: "", zipcode: "", is_default: false })}>
                  Add Address
                </Button>
              </div>
              
              {/* Business Details Section */}
              <div>
                <h3 className="text-lg font-medium mb-2">Business Details</h3>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Business Name</label>
                  <input {...register("business_name")} className="input" placeholder="Business Name" />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">ABN</label>
                  <input {...register("abn")} className="input" placeholder="ABN" />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">ACN</label>
                  <input {...register("acn")} className="input" placeholder="ACN" />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">State License</label>
                  <select {...register("state_licence_state")} className="input">
                    <option value="">Select State</option>
                    <option value="QLD">Queensland (QBCC)</option>
                    <option value="NSW">New South Wales (NSW Fair Trading)</option>
                    <option value="VIC">Victoria (VBA)</option>
                    <option value="WA">Western Australia (DMIRS)</option>
                    <option value="SA">South Australia (CBS)</option>
                    <option value="TAS">Tasmania (CBOS)</option>
                    <option value="ACT">Australian Capital Territory (Access Canberra)</option>
                    <option value="NT">Northern Territory (NT Building Practitioners Board)</option>
                  </select>
                  <input {...register("state_licence_number")} className="input mt-2" placeholder="State License Number" />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">National Certifications</label>
                  <div className="flex flex-col gap-1">
                    <label><input type="checkbox" value="Australian Builder's License" {...register("national_certifications")} /> Australian Builder's License</label>
                    <label><input type="checkbox" value="White Card" {...register("national_certifications")} /> National Construction Induction Card (White Card)</label>
                    <label><input type="checkbox" value="Plumbing Industry Commission License" {...register("national_certifications")} /> Plumbing Industry Commission License</label>
                    <label><input type="checkbox" value="Electrical Contractor's License" {...register("national_certifications")} /> Electrical Contractor's License</label>
                  </div>
                </div>
              </div>
              
              {/* Multiple Emails Section */}
              <div>
                <h3 className="text-lg font-medium mb-2">Email Addresses</h3>
                {emailFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-2">
                    <input
                      {...register(`emails.${index}.address`)}
                      className="input"
                      placeholder="Email address"
                    />
                    <select {...register(`emails.${index}.type`)} className="input">
                      <option value="general">General</option>
                      <option value="general_and_quotes">General & Quotes</option>
                      <option value="invoices">Invoices Only</option>
                    </select>
                    {emailFields.length > 1 && (
                      <Button type="button" variant="destructive" onClick={() => removeEmail(index)}>-</Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendEmail({ address: "", type: "general" })}>Add Email</Button>
              </div>
              
              <div className="flex gap-2 justify-center mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(`/customers/${id}`)}
                  disabled={isSaving || isDeleting}
                  className="border-2 border-gray-800"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                >
                  Delete Customer
                </Button>
              </div>
              {showDeleteConfirm && (
                <div className="mt-4 p-4 border border-red-300 rounded bg-red-50">
                  <p className="mb-2 text-red-700 font-semibold">Type <b>DELETE</b> to confirm customer deletion. This action cannot be undone.</p>
                  <input
                    type="text"
                    value={deleteInput}
                    onChange={e => setDeleteInput(e.target.value)}
                    className="input border-red-400"
                    placeholder="Type DELETE to confirm"
                    disabled={isDeleting}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={deleteInput !== "DELETE" || isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setShowDeleteConfirm(false); setDeleteInput(""); }}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}