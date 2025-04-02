
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { CreditCard, Plus, Loader2 } from 'lucide-react';
import { PaymentMethod } from '../types';

interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  loading: boolean;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ paymentMethods, loading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Saved Payment Methods
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.length > 0 ? (
              paymentMethods.map(method => (
                <div key={method.id} className="flex items-center justify-between border rounded p-3">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{method.card_type} ending in {method.last_four}</div>
                      <div className="text-sm text-muted-foreground">Expires {method.expiry_date}</div>
                    </div>
                  </div>
                  <div className="text-sm text-primary">Edit</div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 mb-4">
                <p className="text-muted-foreground">No payment methods saved</p>
              </div>
            )}
            
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-dashed">
              <Plus className="h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
