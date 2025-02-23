
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function NewCustomer() {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement customer creation logic
    toast.success("Customer created successfully");
    navigate("/customers");
  };

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
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
              <Input id="name" placeholder="Enter customer name" required />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input id="email" type="email" placeholder="Enter email address" required />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
              <Input id="phone" placeholder="Enter phone number" required />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
              <Input id="address" placeholder="Enter address" required />
            </div>

            <div className="flex gap-2 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/customers")}
              >
                Cancel
              </Button>
              <Button type="submit">Add Customer</Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
