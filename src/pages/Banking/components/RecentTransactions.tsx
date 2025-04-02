
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Transaction } from '../types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading: boolean;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions, 
  loading, 
  formatCurrency,
  formatDate
}) => {
  return (
    <Card className="mt-8">
      <CardHeader className="pb-2">
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
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
  );
};

export default RecentTransactions;
