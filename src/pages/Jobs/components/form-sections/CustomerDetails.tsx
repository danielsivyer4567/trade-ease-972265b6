
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { useEffect, useState } from "react";
import { useCustomers } from "../../../Customers/hooks/useCustomers";

interface CustomerDetailsProps {
  customer: string;
  setCustomer: (customer: string) => void;
}

export function CustomerDetails({ customer, setCustomer }: CustomerDetailsProps) {
  const { customers, fetchCustomers } = useCustomers();
  const [useExistingCustomer, setUseExistingCustomer] = useState<boolean>(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  // When a customer is selected from dropdown, set the customer name
  useEffect(() => {
    if (selectedCustomerId && useExistingCustomer) {
      const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
      if (selectedCustomer) {
        setCustomer(selectedCustomer.name);
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
