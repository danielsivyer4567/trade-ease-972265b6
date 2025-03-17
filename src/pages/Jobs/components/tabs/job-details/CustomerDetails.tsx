
import { User } from "lucide-react";
import type { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { AddressFields } from "../../../../Customers/components/AddressFields";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CustomerDetailsProps {
  job: Job;
}

// Define schema for the form
const formSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional()
});

export const CustomerDetails = ({ job }: CustomerDetailsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  
  // Initialize the form with job data if available
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: job.address || "",
      city: job.city || "",
      state: job.state || "",
      zipCode: job.zipCode || ""
    }
  });

  const onSave = async (data: z.infer<typeof formSchema>) => {
    try {
      await supabase
        .from('jobs')
        .update({
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode
        })
        .eq('id', job.id);
      
      toast({
        title: "Address updated",
        description: "The customer address has been successfully updated."
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the address. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white">
      <Button 
        variant="ghost" 
        className="w-full flex justify-between items-center px-3 py-2 rounded-none hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">Customer Details</span>
        </div>
        <span className="text-xs text-gray-500">{job.customer}</span>
      </Button>
      
      {isExpanded && (
        <div className="p-3 pt-2 space-y-2 border-t">
          <div className="text-sm">
            <p><span className="font-semibold">Name:</span> {job.customer}</p>
            <p><span className="font-semibold">Job Number:</span> {job.jobNumber}</p>
            <p><span className="font-semibold">Job Type:</span> {job.type}</p>
            <p><span className="font-semibold">Assigned Team:</span> {job.assignedTeam}</p>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold">Address Information</h3>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSave)}>
                <AddressFields form={form} className={isEditing ? "mt-2" : "mt-2 opacity-70 pointer-events-none"} />
                
                {isEditing && (
                  <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};
