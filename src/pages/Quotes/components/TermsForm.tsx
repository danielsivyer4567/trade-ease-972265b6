
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TermsFormProps {
  onPrevTab: () => void;
  onNextTab: () => void;
}

export const TermsForm = ({ onPrevTab, onNextTab }: TermsFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="quote-validity">Quote Validity (Days)</Label>
        <Input 
          id="quote-validity" 
          type="number" 
          defaultValue="30" 
          className="mt-1 max-w-xs" 
        />
      </div>
      
      <div>
        <Label htmlFor="payment-terms">Payment Terms</Label>
        <Select defaultValue="14-days">
          <SelectTrigger className="mt-1 max-w-md">
            <SelectValue placeholder="Select payment terms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="immediate">Due on Receipt</SelectItem>
            <SelectItem value="7-days">Net 7 Days</SelectItem>
            <SelectItem value="14-days">Net 14 Days</SelectItem>
            <SelectItem value="30-days">Net 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="notes">Notes to Customer</Label>
        <Textarea 
          id="notes" 
          placeholder="Additional information or terms for the customer" 
          rows={5} 
          className="mt-1" 
        />
      </div>
      
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onPrevTab}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNextTab}>
          Next: Preview Quote
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
