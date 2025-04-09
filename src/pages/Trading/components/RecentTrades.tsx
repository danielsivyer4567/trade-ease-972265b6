
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RecentTrades() {
  const trades = [
    { id: 1, symbol: 'AAPL', action: 'buy', shares: 10, price: 182.63, total: 1826.30, time: '10:32 AM' },
    { id: 2, symbol: 'MSFT', action: 'sell', shares: 5, price: 337.22, total: 1686.10, time: '11:15 AM' },
    { id: 3, symbol: 'GOOGL', action: 'buy', shares: 8, price: 134.17, total: 1073.36, time: '01:45 PM' },
    { id: 4, symbol: 'TSLA', action: 'buy', shares: 3, price: 247.50, total: 742.50, time: '02:22 PM' },
    { id: 5, symbol: 'AMZN', action: 'sell', shares: 4, price: 130.37, total: 521.48, time: '03:05 PM' },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Recent Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.map(trade => (
              <TableRow key={trade.id}>
                <TableCell className="font-medium">{trade.symbol}</TableCell>
                <TableCell>
                  <span className={`flex items-center gap-1 ${
                    trade.action === 'buy' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {trade.action === 'buy' ? 
                      <ArrowUp className="h-3 w-3" /> : 
                      <ArrowDown className="h-3 w-3" />
                    }
                    {trade.action.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell className="text-right">{trade.shares}</TableCell>
                <TableCell className="text-right">${trade.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">${trade.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">{trade.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
