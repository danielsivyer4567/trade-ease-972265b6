
import React from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CreditCard } from 'lucide-react';

export default function PaymentsPage() {
  const navigate = useNavigate();
  
  const handleNewPayment = () => {
    navigate('/payments/new');
  };

  return (
    <BaseLayout>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            Payments
          </h1>
          <Button onClick={handleNewPayment} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            New Payment
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-10">
              No payment records found. Create a new payment to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}
