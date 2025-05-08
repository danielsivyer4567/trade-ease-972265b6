import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

// Define the schema shape type that this component expects
interface AddressFieldsProps {
  form: UseFormReturn<any>;
  className?: string;
  inputClassName?: string;
}

export function AddressFields(props: AddressFieldsProps) {
  const { form, className, inputClassName = "" } = props;
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium">Address</h3>
      
      <FormField 
        control={form.control} 
        name="address" 
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <div className={`${inputClassName} max-w-xs w-full border border-gray-700 rounded p-2`}>
                <Textarea placeholder="Enter street address" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />

      <div className="flex flex-col md:flex-row gap-2 mt-4">
        <FormField 
          control={form.control} 
          name="city" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <div className={`${inputClassName} max-w-xs w-full border border-gray-700 rounded p-2`}>
                  <Input placeholder="Enter city" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        <FormField 
          control={form.control} 
          name="state" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>State/Province</FormLabel>
              <FormControl>
                <div className={`${inputClassName} max-w-xs w-full border border-gray-700 rounded p-2`}>
                  <Input placeholder="Enter state" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        <FormField 
          control={form.control} 
          name="zipCode" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip/Postal Code</FormLabel>
              <FormControl>
                <div className={`${inputClassName} max-w-xs w-full border border-gray-700 rounded p-2`}>
                  <Input placeholder="Enter postal code" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
      </div>
    </div>
  );
}
