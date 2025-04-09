
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

// Sample trade data - will be replaced with real database data later
const trades = [
  { id: 1, symbol: 'AAPL', type: 'buy', quantity: 10, price: '186.25', total: '$1,862.50', date: '2024-04-08 14:32:15', status: 'completed' },
  { id: 2, symbol: 'MSFT', type: 'sell', quantity: 5, price: '415.80', total: '$2,079.00', date: '2024-04-08 11:15:32', status: 'completed' },
  { id: 3, symbol: 'AMZN', type: 'buy', quantity: 8, price: '184.60', total: '$1,476.80', date: '2024-04-07 15:45:22', status: 'completed' },
  { id: 4, symbol: 'TSLA', type: 'buy', quantity: 12, price: '172.35', total: '$2,068.20', date: '2024-04-06 09:32:18', status: 'completed' },
  { id: 5, symbol: 'GOOGL', type: 'sell', quantity: 6, price: '175.90', total: '$1,055.40', date: '2024-04-05 13:22:41', status: 'completed' },
];

const RecentTrades = () => {
  const { toast } = useToast();
  
  const handleNewTrade = () => {
    toast({
      title: "Trade feature coming soon",
      description: "The ability to place new trades will be available in an upcoming update.",
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recent Trades</h2>
        <Button onClick={handleNewTrade}>New Trade</Button>
      </div>
      
      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Symbol</th>
                  <th className="text-left py-2 font-medium">Type</th>
                  <th className="text-right py-2 font-medium">Quantity</th>
                  <th className="text-right py-2 font-medium">Price</th>
                  <th className="text-right py-2 font-medium">Total</th>
                  <th className="text-left py-2 font-medium">Date</th>
                  <th className="text-center py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id} className="border-b">
                    <td className="py-3 font-medium">{trade.symbol}</td>
                    <td className="py-3">
                      <Badge className={trade.type === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}>
                        {trade.type === 'buy' ? 'BUY' : 'SELL'}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">{trade.quantity}</td>
                    <td className="py-3 text-right">${trade.price}</td>
                    <td className="py-3 text-right">{trade.total}</td>
                    <td className="py-3">{trade.date}</td>
                    <td className="py-3 text-center">
                      <Badge variant="outline" className="capitalize">
                        {trade.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentTrades;
