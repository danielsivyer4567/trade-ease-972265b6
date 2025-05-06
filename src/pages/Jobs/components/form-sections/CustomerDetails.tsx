import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { useEffect, useState } from "react";
import { useCustomers } from "../../../Customers/hooks/useCustomers";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { AddressFields } from "../../../Customers/components/AddressFields";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CustomerDetailsProps {
  customer: string;
  setCustomer: (customer: string) => void;
  setAddress?: (address: string) => void;
  setCity?: (city: string) => void;
  setState?: (state: string) => void;
  setZipCode?: (zipCode: string) => void;
}

// Define schema for the form
const formSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional()
});

export function CustomerDetails({ 
  customer, 
  setCustomer,
  setAddress,
  setCity, 
  setState,
  setZipCode
}: CustomerDetailsProps) {
  const { customers, fetchCustomers } = useCustomers();
  const [useExistingCustomer, setUseExistingCustomer] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [showAddressFields, setShowAddressFields] = useState(false);
  
  // Initialize the form with empty values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      zipCode: ""
    }
  });

  // Watch form values and update parent component
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (setAddress && value.address !== undefined) {
        setAddress(value.address);
      }
      if (setCity && value.city !== undefined) {
        setCity(value.city);
      }
      if (setState && value.state !== undefined) {
        setState(value.state);
      }
      if (setZipCode && value.zipCode !== undefined) {
        setZipCode(value.zipCode);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setAddress, setCity, setState, setZipCode]);
  
  useEffect(() => {
    // Fetch customers if needed
    if (useExistingCustomer && customers.length === 0) {
      fetchCustomers();
    }
  }, [useExistingCustomer, customers.length, fetchCustomers]);
  
  useEffect(() => {
    // When a customer is selected, populate the customer name and address fields
    if (selectedCustomerId && customers.length > 0) {
      const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
      if (selectedCustomer) {
        setCustomer(selectedCustomer.name);
        
        // Set form values for address fields
        form.setValue("address", selectedCustomer.address || "");
        form.setValue("city", selectedCustomer.city || "");
        form.setValue("state", selectedCustomer.state || "");
        form.setValue("zipCode", selectedCustomer.zipCode || "");
        
        // Push the values up to parent component
        if (setAddress) setAddress(selectedCustomer.address || "");
        if (setCity) setCity(selectedCustomer.city || "");
        if (setState) setState(selectedCustomer.state || "");
        if (setZipCode) setZipCode(selectedCustomer.zipCode || "");
        
        setShowAddressFields(true);
      }
    } else {
      setShowAddressFields(false);
    }
  }, [selectedCustomerId, customers, setCustomer, form, setAddress, setCity, setState, setZipCode]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label htmlFor="useExistingCustomer" className="text-sm">Use existing customer</Label>
        <input
          id="useExistingCustomer"
          type="checkbox"
          checked={useExistingCustomer}
          onChange={() => setUseExistingCustomer(!useExistingCustomer)}
          className="h-4 w-4"
        />
      </div>
      
      {useExistingCustomer ? (
        <div className="space-y-2">
          <Label htmlFor="customerSelect">Select Customer *</Label>
          <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map(customer => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {showAddressFields && (
            <Form {...form}>
              <div className="mt-4">
                <AddressFields form={form} className="mt-4" />
              </div>
            </Form>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer Name *</Label>
            <Input 
              id="customer" 
              value={customer} 
              onChange={e => setCustomer(e.target.value)} 
              placeholder="e.g., John Smith" 
              required 
            />
          </div>
          
          <Form {...form}>
            <AddressFields form={form} className="mt-2" />
          </Form>
        </div>
      )}
    </div>
  );
}
