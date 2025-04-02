
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionsListProps {
  transactions: Transaction[];
  accounts: Array<{ id: string; name: string }>;
  loading: boolean;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions, 
  accounts,
  loading, 
  formatCurrency,
  formatDate
}) => {
  return (
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
        {loading ? (
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
  );
};

export default TransactionsList;
