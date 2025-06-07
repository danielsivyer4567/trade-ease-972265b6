import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useCustomers, Customer } from "../../Customers/hooks/useCustomers";

interface CustomerFormProps {
  onUpdate: (data: any) => void;
  initialData: any;
}

export function CustomerForm({ onUpdate, initialData }: CustomerFormProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const { customers, fetchCustomers } = useCustomers();
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    if (selectedCustomer) {
      const newData = {
        name: selectedCustomer.name,
        email: selectedCustomer.email || '',
        phone: selectedCustomer.phone || '',
        address: `${selectedCustomer.address || ''}, ${selectedCustomer.city || ''}, ${selectedCustomer.state || ''} ${selectedCustomer.zipCode || ''}`.trim()
      };
      setFormData(newData);
      onUpdate(newData);
    }
  }, [selectedCustomerId, customers, onUpdate]);

  useEffect(() => {
    // Sync initialData changes from parent
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData])

  const handleChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(newData);
  };

  return (
    <div className="space-y-4 p-1">
      <div className="space-y-2">
        <Label htmlFor="customer">Select Existing Customer</Label>
        <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
          <SelectTrigger>
            <SelectValue placeholder="Select or type to create new" />
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
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Customer Name" value={formData?.name || ''} onChange={e => handleChange('name', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="customer@example.com" value={formData?.email || ''} onChange={e => handleChange('email', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" placeholder="(555) 123-4567" value={formData?.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea 
          id="address" 
          placeholder="Customer Address" 
          rows={3}
          value={formData?.address || ''}
          onChange={e => handleChange('address', e.target.value)}
        />
      </div>
      
      <div className="flex justify-end mt-6 space-x-2 md:col-span-2">
        <Button onClick={() => {}}>
          Next: Quote Items
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
