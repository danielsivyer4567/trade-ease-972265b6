
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PayRun() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">New Pay Run</h1>
        </div>

        <Card className="p-6">
          <form className="space-y-4">
            <div>
              <label htmlFor="period" className="block text-sm font-medium mb-1">Pay Period</label>
              <Input id="period" type="date" />
            </div>

            <div>
              <label htmlFor="employees" className="block text-sm font-medium mb-1">Employees</label>
              <Input id="employees" placeholder="Select employees" />
            </div>

            <div>
              <label htmlFor="hours" className="block text-sm font-medium mb-1">Hours</label>
              <Input id="hours" type="number" placeholder="Enter total hours" />
            </div>

            <div>
              <label htmlFor="rate" className="block text-sm font-medium mb-1">Rate</label>
              <Input id="rate" type="number" placeholder="Enter hourly rate" />
            </div>

            <Button type="submit" className="w-full">Process Pay Run</Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
