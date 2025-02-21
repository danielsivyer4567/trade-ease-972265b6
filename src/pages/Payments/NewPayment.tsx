
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NewPayment() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">New Payment</h1>
        </div>

        <Card className="p-6">
          <form className="space-y-4">
            <div>
              <label htmlFor="customer" className="block text-sm font-medium mb-1">Customer</label>
              <Input id="customer" placeholder="Select customer" />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount</label>
              <Input id="amount" type="number" placeholder="Enter amount" />
            </div>

            <div>
              <label htmlFor="method" className="block text-sm font-medium mb-1">Payment Method</label>
              <Input id="method" placeholder="Select payment method" />
            </div>

            <div>
              <label htmlFor="reference" className="block text-sm font-medium mb-1">Reference</label>
              <Input id="reference" placeholder="Enter payment reference" />
            </div>

            <Button type="submit" className="w-full">Record Payment</Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
