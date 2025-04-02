
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { BanknoteIcon } from 'lucide-react';
import { BankAccount } from '../types';

interface PaymentFormProps {
  accounts: BankAccount[];
}

const PaymentForm: React.FC<PaymentFormProps> = ({ accounts }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BanknoteIcon className="h-5 w-5" /> 
          Make a Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">From Account</label>
            <select className="w-full px-3 py-2 bg-background border rounded">
              {accounts.length > 0 ? (
                accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.account_number})
                  </option>
                ))
              ) : (
                <option>No accounts available</option>
              )}
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">To</label>
            <select className="w-full px-3 py-2 bg-background border rounded">
              <option>Select recipient...</option>
              <option>Add new recipient...</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Amount</label>
            <input 
              type="text" 
              placeholder="0.00" 
              className="w-full px-3 py-2 bg-background border rounded" 
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <input 
              type="text" 
              placeholder="Payment description" 
              className="w-full px-3 py-2 bg-background border rounded" 
            />
          </div>
          
          <Button className="w-full">Continue</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
