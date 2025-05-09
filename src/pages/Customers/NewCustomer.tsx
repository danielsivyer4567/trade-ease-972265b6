import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CustomerFormValues, useCustomers } from './hooks/useCustomers';
import { CustomerContactFields } from './components/CustomerContactFields';
import { AddressFields } from './components/AddressFields';
import { FormActions } from './components/FormActions';
import { CustomerEmailFields } from './components/CustomerEmailFields';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  emails: z.array(z.object({
    address: z.string().email("Invalid email address").optional().or(z.literal("")),
  })).length(3),
  phone: z.string().min(5, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid street address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(3, "Zip/Postal code is required"),
  // Business details
  business_name: z.string().optional(),
  abn: z.string().optional(),
  acn: z.string().optional(),
  abn_entity_name: z.string().optional(),
  abn_validated: z.boolean().optional(),
  state_licence_state: z.string().optional(),
  state_licence_number: z.string().optional(),
  national_certifications: z.array(z.string()).optional(),
  certification_details: z.record(z.string()).optional()
}).refine(
  (data) => {
    const emails = data.emails || [];
    return (
      (emails[0]?.address && emails[0].address.trim() !== "") ||
      (emails[1]?.address && emails[1].address.trim() !== "")
    );
  },
  {
    message: "At least one of Default Contact or Default Invoice Recipient email must be filled.",
    path: ["emails"]
  }
);

export default function NewCustomer() {
  const navigate = useNavigate();
  const { createCustomer } = useCustomers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      emails: [
        { address: "" },
        { address: "" },
        { address: "" }
      ],
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      business_name: "",
      abn: "",
      acn: "",
      abn_entity_name: "",
      abn_validated: false,
      state_licence_state: "",
      state_licence_number: "",
      national_certifications: [],
      certification_details: {}
    }
  });

  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
    control: form.control,
    name: "emails"
  });

  const [abnStatus, setAbnStatus] = useState<'valid' | 'invalid' | 'checking' | null>(null);

  const handleAbnBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const abn = e.target.value;
    if (!abn || abn.length < 11) {
      setAbnStatus(null);
      form.setValue('abn_validated', false);
      form.setValue('abn_entity_name', '');
      return;
    }
    setAbnStatus('checking');
    try {
      const res = await fetch(`http://localhost:4000/api/abn-lookup?abn=${abn}`);
      const data = await res.json();
      if (data.Abn && data.EntityName) {
        setAbnStatus('valid');
        form.setValue('abn_validated', true);
        form.setValue('abn_entity_name', data.EntityName);
      } else {
        setAbnStatus('invalid');
        form.setValue('abn_validated', false);
        form.setValue('abn_entity_name', '');
      }
    } catch {
      setAbnStatus('invalid');
      form.setValue('abn_validated', false);
      form.setValue('abn_entity_name', '');
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Submitting customer data:", data);
    
    const customerData: CustomerFormValues = {
      name: data.name,
      email: data.emails[0]?.address || data.emails[1]?.address || "",
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

  const certifications = [
    "Australian Builder's License",
    "National Construction Induction Card (White Card)",
    "Plumbing Industry Commission License",
    "Electrical Contractor's License"
  ];
  const watchedCerts = form.watch('national_certifications') || [];

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded mb-4">
          <Link to="/customers" className="hover:text-blue-500">
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold">Add New Customer</h1>
        </div>

        <Card className="p-4 md:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <CustomerContactFields form={form} />
              
              <AddressFields form={form} inputClassName="max-w-xs w-full border border-gray-700 rounded p-2" />
              
              {/* Business Details Section */}
              <div>
                <h3 className="text-lg font-medium mb-2">Business Details</h3>
                <div className="mb-2 max-w-xs w-full border border-gray-700 rounded p-2">
                  <label className="block text-sm font-medium">Business Name</label>
                  <input {...form.register("business_name")} className="input" placeholder="Business Name" />
                </div>
                <div className="mb-2 max-w-xs w-full border border-gray-700 rounded p-2">
                  <label className="block text-sm font-medium">ABN</label>
                  <input {...form.register("abn")} className="input" placeholder="ABN" onBlur={handleAbnBlur} />
                  {abnStatus === 'valid' && <span className="text-green-600">Valid ABN: {form.watch('abn_entity_name')}</span>}
                  {abnStatus === 'invalid' && <span className="text-red-600">Invalid ABN</span>}
                  {abnStatus === 'checking' && <span>Checking ABN...</span>}
                </div>
                <div className="mb-2 max-w-xs w-full border border-gray-700 rounded p-2">
                  <label className="block text-sm font-medium">ACN</label>
                  <input {...form.register("acn")} className="input" placeholder="ACN" />
                </div>
                <div className="mb-2 max-w-xs w-full border border-gray-700 rounded p-2">
                  <label className="block text-sm font-medium">State License</label>
                  <select {...form.register("state_licence_state")} className="input">
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
                  <input {...form.register("state_licence_number")} className="input mt-2" placeholder="State License Number" />
                </div>
                <div className="mb-2 border border-gray-700 rounded p-2 max-w-md w-full">
                  <label className="block text-sm font-medium">National Certifications</label>
                  <div className="flex flex-col gap-1">
                    {certifications.map((cert, idx) => (
                      <div key={cert} className="mb-2 border border-gray-700 rounded p-2 max-w-md w-full">
                        <label>
                          <input
                            type="checkbox"
                            value={cert}
                            {...form.register("national_certifications")}
                          /> {cert}
                        </label>
                        {watchedCerts.includes(cert) && (
                          <div className="mt-1 border border-gray-700 rounded p-2 max-w-md w-full">
                            <input
                              className="input"
                              placeholder={`Enter ${cert} number/details`}
                              {...form.register(`certification_details.${cert}` as const)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
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
