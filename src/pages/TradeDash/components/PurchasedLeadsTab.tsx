
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function PurchasedLeadsTab() {
  const positions = [
    { id: 1, symbol: 'AAPL', shares: 10, avgPrice: 182.63, currentPrice: 187.10, profit: 44.70, profitPercent: 2.45 },
    { id: 2, symbol: 'MSFT', shares: 5, avgPrice: 340.50, currentPrice: 337.22, profit: -16.40, profitPercent: -0.96 },
    { id: 3, symbol: 'GOOGL', shares: 8, avgPrice: 131.20, currentPrice: 134.17, profit: 23.76, profitPercent: 2.26 },
    { id: 4, symbol: 'TSLA', shares: 3, avgPrice: 250.10, currentPrice: 247.50, profit: -7.80, profitPercent: -1.04 },
    { id: 5, symbol: 'AMZN', shares: 6, avgPrice: 128.75, currentPrice: 130.37, profit: 9.72, profitPercent: 1.26 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Avg Price</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-right">Profit/Loss</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map(position => (
              <TableRow key={position.id}>
                <TableCell className="font-medium">{position.symbol}</TableCell>
                <TableCell className="text-right">{position.shares}</TableCell>
                <TableCell className="text-right">${position.avgPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">${position.currentPrice.toFixed(2)}</TableCell>
                <TableCell className={`text-right ${position.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${position.profit.toFixed(2)} ({position.profitPercent >= 0 ? '+' : ''}{position.profitPercent.toFixed(2)}%)
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={position.profit >= 0 ? "success" : "destructive"} className="bg-opacity-10">
                    {position.profit >= 0 ? 'Profitable' : 'Loss'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
