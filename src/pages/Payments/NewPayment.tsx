
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Receipt, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: string;
  due_date: string;
  description: string;
  customer_name?: string;
}

export default function NewPayment() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("status", "pending");

    if (error) {
      toast.error("Failed to fetch invoices");
      return;
    }

    setInvoices(data || []);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const searchLower = searchQuery.toLowerCase();
    const invoiceNumber = invoice.invoice_number.toLowerCase();
    const customerName = (invoice.customer_name || "").toLowerCase();

    return !searchQuery || 
           invoiceNumber.includes(searchLower) || 
           customerName.includes(searchLower);
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Insert the payment
      const { error: paymentError } = await supabase.from("payments").insert([
        {
          invoice_id: selectedInvoice,
          amount: parseFloat(amount),
          payment_date: new Date().toISOString().split('T')[0],
          payment_method: paymentMethod,
          notes,
        },
      ]);

      if (paymentError) throw paymentError;

      // Update the invoice status
      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({ status: "paid" })
        .eq("id", selectedInvoice);

      if (invoiceError) throw invoiceError;

      toast.success("Payment recorded successfully");
      navigate("/customers");
    } catch (error) {
      toast.error("Failed to record payment");
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/customers" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="h-6 w-6" />
            Record Payment
          </h1>
        </div>

        <Card className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by invoice number or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div>
              <label htmlFor="invoice" className="block text-sm font-medium mb-1">
                Select Invoice
              </label>
              <Select
                value={selectedInvoice}
                onValueChange={setSelectedInvoice}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an invoice" />
                </SelectTrigger>
                <SelectContent>
                  {filteredInvoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {`${invoice.invoice_number} - $${invoice.amount} (Due: ${new Date(
                        invoice.due_date
                      ).toLocaleDateString()})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-1">
                Payment Amount
              </label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter payment amount"
                required
              />
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium mb-1">
                Payment Method
              </label>
              <Select
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">
                Notes
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/customers")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Recording Payment..." : "Record Payment"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
