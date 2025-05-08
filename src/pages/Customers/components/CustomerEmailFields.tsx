import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';

interface CustomerEmailFieldsProps {
  form: UseFormReturn<any>;
  className?: string;
}

export function CustomerEmailFields({ form, className }: CustomerEmailFieldsProps) {
  const { register, formState } = form;
  const errors = formState.errors as any;

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <h3 className="text-lg font-medium mb-2">Email Addresses</h3>
      <div className="flex flex-wrap gap-2">
        {/* Default Contact */}
        <div className="flex flex-col items-start max-w-xs w-full">
          <span className="font-semibold mb-1">Default Contact</span>
          <Input
            {...register('emails.0.address')}
            className="input"
            placeholder="Contact email address"
            type="email"
            error={!!errors?.emails?.[0]?.address}
          />
        </div>
        {/* Default Invoice Recipient */}
        <div className="flex flex-col items-start max-w-xs w-full">
          <span className="font-semibold mb-1">Default Invoice Recipient</span>
          <Input
            {...register('emails.1.address')}
            className="input"
            placeholder="Invoice recipient email"
            type="email"
            error={!!errors?.emails?.[1]?.address}
          />
        </div>
        {/* Default CC */}
        <div className="flex flex-col items-start max-w-xs w-full">
          <span className="font-semibold mb-1">Default CC</span>
          <Input
            {...register('emails.2.address')}
            className="input"
            placeholder="CC email address"
            type="email"
            error={!!errors?.emails?.[2]?.address}
          />
        </div>
      </div>
    </div>
  );
} 