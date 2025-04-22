import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  job_id?: string;
  quote_id?: string;
  issue_date: string;
  due_date: string;
  status: "draft" | "sent" | "paid" | "overdue";
  items: {
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }[];
  notes?: string;
  attachments?: {
    id: string;
    file_name: string;
    file_url: string;
    file_type: string;
    uploaded_at: string;
  }[];
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export function useInvoices() {
  const queryClient = useQueryClient();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    },
  });

  const createInvoice = useMutation({
    mutationFn: async (invoice: Omit<Invoice, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("invoices")
        .insert([invoice])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice created successfully");
    },
    onError: (error) => {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    },
  });

  const updateInvoice = useMutation({
    mutationFn: async ({ id, ...invoice }: Partial<Invoice> & { id: string }) => {
      const { data, error } = await supabase
        .from("invoices")
        .update(invoice)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice updated successfully");
    },
    onError: (error) => {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice");
    },
  });

  const deleteInvoice = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("invoices")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice");
    },
  });

  return {
    invoices,
    isLoading,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  };
} 