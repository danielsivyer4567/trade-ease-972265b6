
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NewInvoice() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">Create New Invoice</h1>
        </div>

        <Card className="p-6">
          <form className="space-y-4">
            <div>
              <label htmlFor="customer" className="block text-sm font-medium mb-1">Customer</label>
              <Input id="customer" placeholder="Select customer" />
            </div>

            <div>
              <label htmlFor="items" className="block text-sm font-medium mb-1">Line Items</label>
              <Textarea id="items" placeholder="Enter invoice items" rows={4} />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-1">Total Amount</label>
              <Input id="amount" type="number" placeholder="Enter total amount" />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium mb-1">Due Date</label>
              <Input id="dueDate" type="date" />
            </div>

            <Button type="submit" className="w-full">Create Invoice</Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
