
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowUpDown, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { BankAccount, BankAccountFormData } from '../types';
import CreateAccountForm from './CreateAccountForm';

interface AccountsListProps {
  accounts: BankAccount[];
  loading: {
    accounts: boolean;
    creatingAccount: boolean;
  };
  formatCurrency: (amount: number) => string;
  onRefresh: (accountId: string) => Promise<void>;
  onAddAccount: (data: BankAccountFormData) => Promise<void>;
}

const AccountsList: React.FC<AccountsListProps> = ({ 
  accounts, 
  loading, 
  formatCurrency,
  onRefresh,
  onAddAccount
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (loading.accounts) {
    return (
      <div className="h-40 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map(account => (
          <Card key={account.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{account.name}</CardTitle>
                <span className="text-sm text-muted-foreground">{account.bank}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{formatCurrency(account.balance)}</div>
              <div className="text-sm text-muted-foreground">Account: {account.account_number}</div>
              <div className="flex justify-between items-center mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary flex items-center gap-1"
                  onClick={() => onRefresh(account.id)}
                  disabled={loading.accounts}
                >
                  <ArrowUpDown className="h-4 w-4" />
                  Refresh
                </Button>
                <Button variant="ghost" size="sm" className="text-primary">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add New Account Card */}
        <Card 
          className="border-dashed hover:shadow-md transition-shadow bg-muted/50 cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center h-full p-6">
            <Wallet className="h-12 w-12 text-muted-foreground mb-2" />
            <CardTitle className="text-muted-foreground text-lg mb-2">Add Account</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Connect a new bank account or card
            </p>
          </CardContent>
        </Card>
      </div>
      
      <CreateAccountForm 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateAccount={onAddAccount}
        isSubmitting={loading.creatingAccount}
      />
    </>
  );
};

export default AccountsList;
