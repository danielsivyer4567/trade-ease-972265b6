
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BankAccountFormData } from '../types';
import { Landmark, PlusCircle } from 'lucide-react';

// Define the form schema with required fields to match BankAccountFormData type
const formSchema = z.object({
  name: z.string().min(2, { message: "Account name is required" }),
  bank: z.string().min(2, { message: "Bank name is required" }),
  account_number: z.string().min(5, { message: "Account number is required" }),
  initial_balance: z.coerce.number().min(0, { message: "Balance must be a positive number" }),
});

// Ensure the schema matches the BankAccountFormData type
type FormSchemaType = z.infer<typeof formSchema>;

interface CreateAccountFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAccount: (data: BankAccountFormData) => Promise<void>;
  isSubmitting: boolean;
}

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({ 
  open, 
  onOpenChange, 
  onCreateAccount,
  isSubmitting
}) => {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bank: "",
      account_number: "",
      initial_balance: 0,
    },
  });

  const handleSubmit = async (values: FormSchemaType) => {
    // Using type assertion to ensure TypeScript knows all required fields are present
    await onCreateAccount(values as BankAccountFormData);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Landmark className="h-5 w-5" /> Add New Bank Account
          </DialogTitle>
          <DialogDescription>
            Enter your bank account details below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Checking Account" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Chase, Bank of America, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Last 4-6 digits" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="initial_balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Balance ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex items-center gap-1"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccountForm;
