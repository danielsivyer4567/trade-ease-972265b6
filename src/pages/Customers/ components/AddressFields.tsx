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

export function AddressFields({
  form,
  className,
  inputClassName = ""
}: AddressFieldsProps) {
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
              <div className={inputClassName}>
                <Textarea placeholder="Enter street address" {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField 
          control={form.control} 
          name="city" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <div className={inputClassName}>
                  <Input placeholder="Enter city" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField 
            control={form.control} 
            name="state" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <div className={inputClassName}>
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
                  <div className={inputClassName}>
                    <Input placeholder="Enter postal code" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
        </div>
      </div>
    </div>
  );
} 