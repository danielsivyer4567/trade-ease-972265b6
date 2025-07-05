
import React, { useState } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BanknoteIcon, Brain, Zap, Bot } from 'lucide-react';
import { useBankingData } from './hooks/useBankingData';
import { type FinancialTransaction } from '@/services/AIAccountingService';

// Import components
import AccountsList from './components/AccountsList';
import RecentTransactions from './components/RecentTransactions';
import TransactionsList from './components/TransactionsList';
import PaymentForm from './components/PaymentForm';
import PaymentMethods from './components/PaymentMethods';
import ScheduledPayments from './components/ScheduledPayments';
import AIDocumentProcessor from './components/AIDocumentProcessor';
import IntegrationSyncManager from './components/IntegrationSyncManager';

const BankingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("accounts");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
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

  // Set the first account as selected by default
  React.useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  const handleTransactionCreated = (transaction: FinancialTransaction) => {
    // Refresh transactions or update local state
    console.log('New transaction created:', transaction);
    // You might want to refresh the banking data here
  };

  const handleTransactionsImported = (count: number) => {
    console.log(`${count} transactions imported`);
    // Refresh the banking data to show new transactions
  };

  return (
    <BaseLayout>
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <BanknoteIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">AI-Powered Accounting</h1>
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
            <Brain className="h-3 w-3 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">AI Enhanced</span>
          </div>
        </div>
        
        <Tabs 
          defaultValue="accounts" 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="ai-processing" className="flex items-center gap-1">
              <Bot className="h-3 w-3" />
              AI Processing
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Sync
            </TabsTrigger>
          </TabsList>
          
          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-4">
            <AccountsList 
              accounts={accounts}
              loading={{
                accounts: loading.accounts,
                creatingAccount: loading.creatingAccount
              }}
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

          {/* AI Processing Tab */}
          <TabsContent value="ai-processing" className="space-y-4">
            <div className="space-y-6">
              {/* Account Selector */}
              {accounts.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-2">Select Account for Processing:</label>
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} - {account.bank} (${formatCurrency(account.balance)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* AI Document Processor */}
              <AIDocumentProcessor
                accounts={accounts}
                selectedAccountId={selectedAccountId}
                onTransactionCreated={handleTransactionCreated}
              />
            </div>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-4">
            <div className="space-y-6">
              {/* Account Selector */}
              {accounts.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-2">Select Account for Sync:</label>
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} - {account.bank} (${formatCurrency(account.balance)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Integration Sync Manager */}
              <IntegrationSyncManager
                accounts={accounts}
                selectedAccountId={selectedAccountId}
                onTransactionsImported={handleTransactionsImported}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
};

export default BankingPage;
