import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CustomerEmailFieldsProps {
  form: UseFormReturn<any>;
  className?: string;
}

export function CustomerEmailFields({ form, className }: CustomerEmailFieldsProps) {
  const { control, register } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'emails',
  });

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <h3 className="text-lg font-medium mb-2">Email Addresses</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2 mb-2">
          <Input
            {...register(`emails.${index}.address`)}
            className="input"
            placeholder="Email address"
            type="email"
          />
          <select {...register(`emails.${index}.type`)} className="input">
            <option value="general">General</option>
            <option value="general_and_quotes">General & Quotes</option>
            <option value="invoices">Invoices Only</option>
          </select>
          {fields.length > 1 && (
            <Button type="button" variant="destructive" onClick={() => remove(index)}>-</Button>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => append({ address: '', type: 'general' })}>
        Add Email
      </Button>
    </div>
  );
} 