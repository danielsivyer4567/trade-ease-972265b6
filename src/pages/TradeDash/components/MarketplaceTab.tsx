
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function MarketplaceTab() {
  const opportunities = [
    { id: 1, symbol: 'AMD', price: 115.70, change: 2.35, volume: '12.5M', recommendation: 'Buy' },
    { id: 2, symbol: 'NVDA', price: 625.30, change: 4.75, volume: '25.8M', recommendation: 'Strong Buy' },
    { id: 3, symbol: 'INTC', price: 31.25, change: -0.85, volume: '8.1M', recommendation: 'Hold' },
    { id: 4, symbol: 'META', price: 326.80, change: 1.25, volume: '15.2M', recommendation: 'Buy' },
    { id: 5, symbol: 'UBER', price: 67.40, change: -1.50, volume: '9.8M', recommendation: 'Hold' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h Change</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead>Recommendation</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map(opportunity => (
              <TableRow key={opportunity.id}>
                <TableCell className="font-medium">{opportunity.symbol}</TableCell>
                <TableCell className="text-right">${opportunity.price.toFixed(2)}</TableCell>
                <TableCell className={`text-right ${opportunity.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {opportunity.change >= 0 ? '+' : ''}{opportunity.change.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right">{opportunity.volume}</TableCell>
                <TableCell>{opportunity.recommendation}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm">Buy</Button>
                    <Button size="sm" variant="outline">Details</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
