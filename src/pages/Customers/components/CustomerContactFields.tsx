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
            <div className="flex items-center space-x-4">
              <FormControl>
                <Input 
                  placeholder="Enter phone number" 
                  maxLength={15} 
                  {...field} 
                  className="max-w-[6.5rem] w-full" 
                />
              </FormControl>
              
              <Button 
                type="button"
                size="sm"
                variant="outline"
                className="border-2 border-gray-700 p-2 h-9 w-12 flex items-center justify-center" 
                onClick={() => handleSendMessage(field.value)}
                aria-label="Auto text message"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-start space-x-4 mt-1">
              <div className="w-[6.5rem]">
                {/* spacer */}
              </div>
              <span className="text-xs text-gray-600">auto text</span>
            </div>
            <FormMessage />
          </FormItem>
        )} 
      />
    </div>
  );
}
