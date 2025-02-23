
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NewCustomer() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/customers" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">Add New Customer</h1>
        </div>

        <Card className="p-6">
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
              <Input id="name" placeholder="Enter customer name" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
              <Input id="address" placeholder="Enter address" />
            </div>

            <Button type="submit" className="w-full">Add Customer</Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
