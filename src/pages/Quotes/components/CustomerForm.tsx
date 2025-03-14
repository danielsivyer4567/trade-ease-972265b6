
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface CustomerFormProps {
  onNextTab: () => void;
}

export const CustomerForm = ({ onNextTab }: CustomerFormProps) => {
  const [customer, setCustomer] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [quoteNumber] = useState<string>("Q-2024-009");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="customer">Customer</Label>
          <Select value={customer} onValueChange={setCustomer}>
            <SelectTrigger>
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="john-smith">John Smith</SelectItem>
              <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
              <SelectItem value="michael-williams">Michael Williams</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            placeholder="customer@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea 
            id="address" 
            placeholder="Customer address" 
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="quote-number">Quote #</Label>
          <Input id="quote-number" value={quoteNumber} readOnly className="bg-gray-50" />
        </div>
      </div>
      
      <div className="flex justify-end mt-6 space-x-2 md:col-span-2">
        <Button onClick={onNextTab}>
          Next: Quote Items
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
