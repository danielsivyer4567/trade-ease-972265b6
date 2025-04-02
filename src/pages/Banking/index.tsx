
import React, { useState } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BanknoteIcon } from 'lucide-react';
import { useBankingData } from './hooks/useBankingData';

// Import components
import AccountsList from './components/AccountsList';
import RecentTransactions from './components/RecentTransactions';
import TransactionsList from './components/TransactionsList';
import PaymentForm from './components/PaymentForm';
import PaymentMethods from './components/PaymentMethods';
import ScheduledPayments from './components/ScheduledPayments';

const BankingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("accounts");
  const {
    accounts,
    transactions,
    paymentMethods,
    loading,
    handleAddAccount,
    handleRefreshAccount,
    formatCurrency,
    formatDate
  } = useBankingData();

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
            <AccountsList 
              accounts={accounts}
              loading={loading.accounts}
              formatCurrency={formatCurrency}
              onRefresh={handleRefreshAccount}
              onAddAccount={handleAddAccount}
            />
            
            <RecentTransactions 
              transactions={transactions}
              loading={loading.transactions}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          </TabsContent>
          
          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <TransactionsList 
              transactions={transactions}
              accounts={accounts}
              loading={loading.transactions}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          </TabsContent>
          
          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PaymentForm accounts={accounts} />
              <PaymentMethods 
                paymentMethods={paymentMethods} 
                loading={loading.paymentMethods} 
              />
            </div>
            
            <ScheduledPayments />
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
};

export default BankingPage;
