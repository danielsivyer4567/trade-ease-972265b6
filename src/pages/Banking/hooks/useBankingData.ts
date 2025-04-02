
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BankAccount, Transaction, PaymentMethod } from '../types';
import { useToast } from '@/components/ui/use-toast';

export const useBankingData = () => {
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

  // Formatting utilities
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return {
    accounts,
    transactions,
    paymentMethods,
    loading,
    handleAddAccount,
    handleRefreshAccount,
    formatCurrency,
    formatDate
  };
};
