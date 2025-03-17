
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerDetailsProps {
  customer: string;
  setCustomer: (customer: string) => void;
}

export function CustomerDetails({ customer, setCustomer }: CustomerDetailsProps) {
  return (
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
  );
}
