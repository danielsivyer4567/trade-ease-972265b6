import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
interface CustomerContactFieldsProps {
  form: UseFormReturn<any>;
  className?: string;
}
export function CustomerContactFields({
  form,
  className
}: CustomerContactFieldsProps) {
  return <div className="bg-slate-300">
      <FormField control={form.control} name="name" render={({
      field
    }) => <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter customer name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>} />

      <FormField control={form.control} name="email" render={({
      field
    }) => <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter email address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>} />

      <FormField control={form.control} name="phone" render={({
      field
    }) => <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input placeholder="Enter phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>} />
    </div>;
}