
import React, { useState, useEffect } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BanknoteIcon, ArrowUpDown, Wallet, CreditCard, Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface BankAccount {
  id: string;
  name: string;
  balance: number;
  account_number: string;
  bank: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
}

interface PaymentMethod {
  id: string;
  card_type: string;
  last_four: string;
  expiry_date: string;
}

const BankingPage = () => {
  const [activeTab, setActiveTab] = useState<string>("accounts");
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState({
    accounts: true,
    transactions: true,
    paymentMethods: true
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchBankingData = async () => {
      try {
        // Fetch accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from('bank_accounts')
          .select('*');

        if (accountsError) throw accountsError;
        setAccounts(accountsData || []);
        setLoading(prev => ({ ...prev, accounts: false }));

        // If we have accounts, fetch transactions for the first account
        if (accountsData && accountsData.length > 0) {
          const { data: transactionsData, error: transactionsError } = await supabase
            .from('bank_transactions')
            .select('*')
            .eq('account_id', accountsData[0].id)
            .order('date', { ascending: false });

          if (transactionsError) throw transactionsError;
          setTransactions(transactionsData || []);
        }
        setLoading(prev => ({ ...prev, transactions: false }));

        // Fetch payment methods
        const { data: paymentMethodsData, error: paymentMethodsError } = await supabase
          .from('payment_methods')
          .select('*');

        if (paymentMethodsError) throw paymentMethodsError;
        setPaymentMethods(paymentMethodsData || []);
        setLoading(prev => ({ ...prev, paymentMethods: false }));
      } catch (error) {
        console.error('Error fetching banking data:', error);
        toast({
          title: "Error fetching data",
          description: "Failed to load your banking information.",
          variant: "destructive"
        });
        setLoading({
          accounts: false,
          transactions: false,
          paymentMethods: false
        });
      }
    };

    fetchBankingData();
  }, [toast]);

  const handleAddAccount = () => {
    // This would open a modal/form to add a new bank account
    toast({
      title: "Coming Soon",
      description: "The ability to add new accounts will be available soon."
    });
  };

  const handleRefreshAccount = async (accountId: string) => {
    try {
      setLoading(prev => ({ ...prev, accounts: true }));
      
      // In a real app, this would connect to a bank API to refresh the balance
      // For now, we'll just refetch from our database
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('id', accountId)
        .single();
      
      if (error) throw error;
      
      // Update the specific account in the accounts array
      setAccounts(prev => 
        prev.map(acc => 
          acc.id === accountId ? data : acc
        )
      );
      
      toast({
        title: "Account refreshed",
        description: "Your account information has been updated."
      });
    } catch (error) {
      console.error('Error refreshing account:', error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh account information.",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, accounts: false }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <BaseLayout>
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <BanknoteIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Banking</h1>
        </div>
        
        <Tabs 
          defaultValue="accounts" 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          
          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-4">
            {loading.accounts ? (
              <div className="h-40 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
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
                          onClick={() => handleRefreshAccount(account.id)}
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
                  onClick={handleAddAccount}
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
            )}
            
            <Card className="mt-8">
              <CardHeader className="pb-2">
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {loading.transactions ? (
                  <div className="h-20 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.slice(0, 3).map(transaction => (
                      <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(transaction.date)}
                          </div>
                        </div>
                        <div className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                          {transaction.type === "credit" ? "+" : "-"}{formatCurrency(Math.abs(transaction.amount))}
                        </div>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full mt-4 text-primary text-sm">
                      View All Transactions
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No recent transactions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>Transaction History</CardTitle>
                  <div className="flex gap-2">
                    <select className="px-2 py-1 bg-background border rounded text-sm">
                      <option>All Accounts</option>
                      {accounts.map(account => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                      ))}
                    </select>
                    <select className="px-2 py-1 bg-background border rounded text-sm">
                      <option>Last 30 Days</option>
                      <option>Last 60 Days</option>
                      <option>Last 90 Days</option>
                      <option>Custom Range</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-0">
                {loading.transactions ? (
                  <div className="h-40 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-1">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="grid grid-cols-3 md:grid-cols-4 py-2 px-4 border-b hover:bg-muted/40"
                      >
                        <div className="text-sm">
                          {formatDate(transaction.date)}
                        </div>
                        <div className="col-span-2 md:col-span-2 font-medium">
                          {transaction.description}
                        </div>
                        <div className={`text-right ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                          {transaction.type === "credit" ? "+" : "-"}{formatCurrency(Math.abs(transaction.amount))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No transactions found</p>
                  </div>
                )}
                {transactions.length > 0 && (
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" className="bg-primary/10 text-primary rounded-md">
                      Load More Transactions
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Saved Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading.paymentMethods ? (
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
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No scheduled payments</p>
                  <Button variant="link" className="mt-2 text-primary text-sm">Set up recurring payment</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
};

export default BankingPage;
