import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CustomerEmailFields } from './CustomerEmailFields';
import { Button } from "@/components/ui/button";
import { MessageSquare } from 'lucide-react';

interface CustomerContactFieldsProps {
  form: UseFormReturn<any>;
  className?: string;
}

export function CustomerContactFields({
  form,
  className
}: CustomerContactFieldsProps) {
  const handleSendMessage = (phone: string) => {
    // This would be replaced with actual email sending logic
    if (phone) {
      console.log(`Auto message will be sent to ${phone}`);
      alert(`Message will be sent to ${phone}`);
    } else {
      alert('Please enter a phone number first');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium">Contact Information</h3>

      <FormField 
        control={form.control} 
        name="name" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <div className="max-w-xs w-full">
                <Input placeholder="Enter customer name" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />

      <CustomerEmailFields form={form} />

      <FormField 
        control={form.control} 
        name="phone" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                <div className="max-w-[6.5rem] w-full">
                  <Input placeholder="Enter phone number" maxLength={15} {...field} />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-600 mb-1">auto text feature</span>
                  <Button 
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border border-gray-700 p-2"
                    onClick={() => handleSendMessage(field.value)}
                    title="Send auto message via email"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
    </div>
  );
}
