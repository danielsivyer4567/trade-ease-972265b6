import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CustomerEmailFields } from './CustomerEmailFields';

interface CustomerContactFieldsProps {
  form: UseFormReturn<any>;
  className?: string;
}

export function CustomerContactFields({
  form,
  className
}: CustomerContactFieldsProps) {
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
              <div className="max-w-[6.5rem] w-full">
                <Input placeholder="Enter phone number" maxLength={15} {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />
    </div>
  );
}
