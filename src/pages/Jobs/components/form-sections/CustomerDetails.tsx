
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
}

// Define schema for the form
const formSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional()
});

export function CustomerDetails({ customer, setCustomer }: CustomerDetailsProps) {
  const { customers, fetchCustomers } = useCustomers();
  const [useExistingCustomer, setUseExistingCustomer] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [showAddressFields, setShowAddressFields] = useState<boolean>(false);
  
  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      zipCode: ""
    }
  });

  useEffect(() => {
    console.log("Fetching customers");
    fetchCustomers();
  }, []);

  // When a customer is selected from dropdown, set the customer name
  useEffect(() => {
    if (selectedCustomerId && useExistingCustomer) {
      const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
      if (selectedCustomer) {
        console.log("Selected customer:", selectedCustomer);
        setCustomer(selectedCustomer.name);
        
        // Set the address fields values
        form.setValue("address", selectedCustomer.address || "");
        form.setValue("city", selectedCustomer.city || "");
        form.setValue("state", selectedCustomer.state || "");
        form.setValue("zipCode", selectedCustomer.zipCode || ""); // Make sure it uses zipCode not zipcode
        
        // Show address fields when a customer is selected
        setShowAddressFields(true);
      }
    }
  }, [selectedCustomerId, useExistingCustomer, customers]);

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
      )}
    </div>
  );
}
