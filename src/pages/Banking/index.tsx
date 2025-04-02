
import React, { useState } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BanknoteIcon, ArrowUpDown, Wallet, CreditCard } from 'lucide-react';

const BankingPage = () => {
  const [activeTab, setActiveTab] = useState<string>("accounts");

  // Mock banking data - in a real app, this would come from an API
  const accounts = [
    { id: "1", name: "Business Checking", balance: 12450.65, accountNumber: "xxxx-xxxx-1234", bank: "National Bank" },
    { id: "2", name: "Savings", balance: 8745.22, accountNumber: "xxxx-xxxx-5678", bank: "National Bank" },
    { id: "3", name: "Tax Fund", balance: 3250.00, accountNumber: "xxxx-xxxx-9012", bank: "Credit Union" },
  ];
  
  const recentTransactions = [
    { id: "t1", date: "2023-06-15", description: "Customer Payment - Smith", amount: 1250.00, type: "credit" },
    { id: "t2", date: "2023-06-14", description: "Material Supply Co.", amount: -458.75, type: "debit" },
    { id: "t3", date: "2023-06-12", description: "Vehicle Fuel", amount: -120.50, type: "debit" },
    { id: "t4", date: "2023-06-10", description: "Customer Payment - Johnson", amount: 2100.00, type: "credit" },
  ];
  
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
                    <div className="text-2xl font-bold mb-2">${account.balance.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Account: {account.accountNumber}</div>
                    <div className="flex justify-between items-center mt-4">
                      <button className="text-sm text-primary flex items-center gap-1">
                        <ArrowUpDown className="h-4 w-4" />
                        Refresh
                      </button>
                      <button className="text-sm text-primary">View Details</button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add New Account Card */}
              <Card className="border-dashed hover:shadow-md transition-shadow bg-muted/50">
                <CardContent className="flex flex-col items-center justify-center h-full p-6">
                  <Wallet className="h-12 w-12 text-muted-foreground mb-2" />
                  <CardTitle className="text-muted-foreground text-lg mb-2">Add Account</CardTitle>
                  <p className="text-sm text-muted-foreground text-center">
                    Connect a new bank account or card
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-8">
              <CardHeader className="pb-2">
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.slice(0, 3).map(transaction => (
                    <div key={transaction.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                        {transaction.type === "credit" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-center text-primary text-sm">
                  View All Transactions
                </button>
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
                      <option>Business Checking</option>
                      <option>Savings</option>
                      <option>Tax Fund</option>
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
                <div className="space-y-1">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="grid grid-cols-3 md:grid-cols-4 py-2 px-4 border-b hover:bg-muted/40"
                    >
                      <div className="text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                      <div className="col-span-2 md:col-span-2 font-medium">
                        {transaction.description}
                      </div>
                      <div className={`text-right ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.type === "credit" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <button className="bg-primary/10 text-primary rounded-md px-3 py-2 text-sm">
                    Load More Transactions
                  </button>
                </div>
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
                        <option>Business Checking (xxxx-1234)</option>
                        <option>Savings (xxxx-5678)</option>
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
                    
                    <button className="w-full bg-primary text-primary-foreground py-2 rounded">
                      Continue
                    </button>
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border rounded p-3">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Visa ending in 4242</div>
                          <div className="text-sm text-muted-foreground">Expires 12/25</div>
                        </div>
                      </div>
                      <div className="text-sm text-primary">Edit</div>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded p-3">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <div className="font-medium">Mastercard ending in 5678</div>
                          <div className="text-sm text-muted-foreground">Expires 03/26</div>
                        </div>
                      </div>
                      <div className="text-sm text-primary">Edit</div>
                    </div>
                    
                    <button className="w-full flex items-center justify-center gap-2 py-2 border border-dashed rounded text-primary">
                      <span className="h-4 w-4">+</span>
                      Add Payment Method
                    </button>
                  </div>
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
                  <button className="mt-2 text-primary text-sm">Set up recurring payment</button>
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
