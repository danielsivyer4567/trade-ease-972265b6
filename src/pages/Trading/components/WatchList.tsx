
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";

// Sample watchlist data - will be replaced with real database data later
const initialWatchlist = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: '188.12', change: '+1.45%', color: 'text-green-500' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: '416.38', change: '+0.78%', color: 'text-green-500' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '176.52', change: '-0.32%', color: 'text-red-500' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: '185.80', change: '+1.12%', color: 'text-green-500' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '175.34', change: '-2.15%', color: 'text-red-500' },
];

const WatchList = () => {
  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [newSymbol, setNewSymbol] = useState('');
  
  const handleAddSymbol = () => {
    if (!newSymbol) return;
    
    // In a real app, we would validate the symbol and fetch its data
    // For now, let's just add a dummy entry
    const mockNewEntry = {
      symbol: newSymbol.toUpperCase(),
      name: `${newSymbol.toUpperCase()} Corp.`,
      price: (Math.random() * 1000).toFixed(2),
      change: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 3).toFixed(2)}%`,
      color: Math.random() > 0.5 ? 'text-green-500' : 'text-red-500'
    };
    
    setWatchlist([...watchlist, mockNewEntry]);
    setNewSymbol('');
    toast.success(`Added ${newSymbol.toUpperCase()} to watchlist`);
  };
  
  const handleRemoveSymbol = (symbol) => {
    setWatchlist(watchlist.filter(item => item.symbol !== symbol));
    toast.success(`Removed ${symbol} from watchlist`);
  };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>My Watchlist</CardTitle>
            <CardDescription>Symbols you're tracking</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Input 
              value={newSymbol} 
              onChange={(e) => setNewSymbol(e.target.value)} 
              placeholder="Add symbol..." 
              className="w-24 md:w-32"
            />
            <Button size="sm" onClick={handleAddSymbol}>
              <Plus className="h-4 w-4 mr-1" />
              <span>Add</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">Symbol</th>
                <th className="text-left py-2 font-medium">Name</th>
                <th className="text-right py-2 font-medium">Price</th>
                <th className="text-right py-2 font-medium">Change</th>
                <th className="text-right py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item) => (
                <tr key={item.symbol} className="border-b">
                  <td className="py-3 font-medium">{item.symbol}</td>
                  <td className="py-3">{item.name}</td>
                  <td className="py-3 text-right">${item.price}</td>
                  <td className={`py-3 text-right ${item.color}`}>{item.change}</td>
                  <td className="py-3 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={() => handleRemoveSymbol(item.symbol)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchList;
