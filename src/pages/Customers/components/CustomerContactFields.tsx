import React, { useState } from 'react';
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
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleSendMessage = (phone: string) => {
    // This would be replaced with actual email sending logic
    if (phone) {
      console.log(`Auto message will be sent to ${phone}`);
      alert(`Message will be sent to ${phone}`);
      setButtonClicked(true);
      
      // Reset the button color after 2 seconds
      setTimeout(() => {
        setButtonClicked(false);
      }, 2000);
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
            <div>
              <div className="flex mb-1">
                <div className="w-[6.5rem] text-xs">Phone</div>
                <div className="text-xs text-gray-600 ml-4">auto text</div>
              </div>
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
                  className={`border-2 ${buttonClicked ? 'border-green-500 bg-green-50' : 'border-gray-700'} h-9 w-12 flex items-center justify-center p-0`} 
                  onClick={() => handleSendMessage(field.value)}
                  aria-label="Auto text message"
                >
                  <MessageSquare className={`h-5 w-5 ${buttonClicked ? 'text-green-500' : ''}`} />
                </Button>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )} 
      />
    </div>
  );
}
