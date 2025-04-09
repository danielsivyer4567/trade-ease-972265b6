
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Plus, ArrowUp, ArrowDown } from "lucide-react";

export function WatchList() {
  const [watchlist, setWatchlist] = React.useState([
    { symbol: 'AAPL', name: 'Apple Inc.', price: 182.63, change: 2.45, changePercent: 1.35 },
    { symbol: 'MSFT', name: 'Microsoft', price: 337.22, change: -4.18, changePercent: -1.22 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 134.17, change: 1.25, changePercent: 0.94 },
    { symbol: 'AMZN', name: 'Amazon.com', price: 130.37, change: -2.12, changePercent: -1.62 }
  ]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          Watchlist
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-0">
        <div className="px-4 pb-2 text-sm text-muted-foreground flex justify-between border-b">
          <span>Symbol</span>
          <span>Price</span>
        </div>
        <div className="divide-y">
          {watchlist.map((stock) => (
            <div key={stock.symbol} className="px-4 py-3 flex justify-between items-center">
              <div>
                <div className="font-medium">{stock.symbol}</div>
                <div className="text-xs text-muted-foreground">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">${stock.price.toFixed(2)}</div>
                <div className={`text-xs flex items-center gap-1 ${
                  stock.change > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stock.change > 0 ? 
                    <ArrowUp className="h-3 w-3" /> : 
                    <ArrowDown className="h-3 w-3" />
                  }
                  {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 pt-4">
          <Button className="w-full text-sm" size="sm">View All</Button>
        </div>
      </CardContent>
    </Card>
  );
}
