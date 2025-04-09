
import React, { useState, useEffect } from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  high: number;
  low: number;
  volume: number;
}

export default function TradingPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('market');

  useEffect(() => {
    // Mock data since we don't have a real API yet
    const mockStocks: Stock[] = [
      { id: '1', symbol: 'AAPL', name: 'Apple Inc.', price: 173.88, change: 1.23, high: 175.21, low: 172.55, volume: 63982100 },
      { id: '2', symbol: 'MSFT', name: 'Microsoft Corp.', price: 403.78, change: -0.56, high: 405.63, low: 401.32, volume: 23147800 },
      { id: '3', symbol: 'GOOGL', name: 'Alphabet Inc.', price: 143.96, change: 2.19, high: 144.52, low: 141.31, volume: 27891400 },
      { id: '4', symbol: 'AMZN', name: 'Amazon.com Inc.', price: 182.41, change: 1.05, high: 184.73, low: 181.20, volume: 41658200 },
      { id: '5', symbol: 'META', name: 'Meta Platforms Inc.', price: 492.16, change: 5.34, high: 497.22, low: 487.58, volume: 15972300 },
      { id: '6', symbol: 'TSLA', name: 'Tesla Inc.', price: 175.22, change: -3.81, high: 179.58, low: 174.96, volume: 92641700 },
      { id: '7', symbol: 'NVDA', name: 'NVIDIA Corp.', price: 881.77, change: 15.62, high: 889.43, low: 868.24, volume: 43215600 },
      { id: '8', symbol: 'BRK.A', name: 'Berkshire Hathaway', price: 614370, change: 2150, high: 617500, low: 612150, volume: 870 },
    ];

    setStocks(mockStocks);
    
    // Initialize with a few stocks in watchlist
    setWatchlist([mockStocks[0], mockStocks[3], mockStocks[6]]);
    
    setIsLoading(false);
    
    // TODO: Fetch real data from a trading API or our database
    const fetchStocks = async () => {
      try {
        // This will be implemented once the backend is set up with the trading data
      } catch (error) {
        console.error('Error fetching stocks:', error);
        toast.error('Failed to load market data');
      }
    };
    
    // fetchStocks();
  }, []);

  const handleAddToWatchlist = (stock: Stock) => {
    if (!watchlist.some(item => item.id === stock.id)) {
      setWatchlist([...watchlist, stock]);
      toast.success(`Added ${stock.symbol} to watchlist`);
      
      // TODO: Sync with database when backend is ready
    }
  };
  
  const handleRemoveFromWatchlist = (stockId: string) => {
    setWatchlist(watchlist.filter(stock => stock.id !== stockId));
    toast.success('Removed from watchlist');
    
    // TODO: Sync with database when backend is ready
  };
  
  const handleBuyStock = (stock: Stock) => {
    // This will be connected to the backend once it's set up
    toast.success(`Market order placed for ${stock.symbol}`);
  };

  // Mock chart data
  const chartData = [
    { name: '9:30', value: 173.25 },
    { name: '10:00', value: 173.46 },
    { name: '10:30', value: 173.68 },
    { name: '11:00', value: 173.55 },
    { name: '11:30', value: 173.32 },
    { name: '12:00', value: 173.41 },
    { name: '12:30', value: 173.62 },
    { name: '13:00', value: 173.78 },
    { name: '13:30', value: 173.92 },
    { name: '14:00', value: 173.85 },
    { name: '14:30', value: 173.94 },
    { name: '15:00', value: 174.01 },
    { name: '15:30', value: 173.88 },
  ];

  const marketOverviewData = [
    { name: 'Tech', value: 3.2 },
    { name: 'Finance', value: 1.8 },
    { name: 'Healthcare', value: -0.5 },
    { name: 'Energy', value: 2.7 },
    { name: 'Utilities', value: 0.3 },
    { name: 'Consumer', value: 1.2 },
  ];

  return (
    <BaseLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Trading Platform</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setActiveTab('market')}>Market Overview</Button>
            <Button variant="outline" onClick={() => setActiveTab('watchlist')}>My Watchlist</Button>
            <Button onClick={() => window.location.href = '/trade-dashboard'}>Go to Dashboard</Button>
          </div>
        </div>
        
        <Tabs defaultValue="market" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
          </TabsList>
          
          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Overview</CardTitle>
                  <CardDescription>Sector performance today</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketOverviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>AAPL</CardTitle>
                  <CardDescription>Apple Inc. daily performance</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#6366f1" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Market Movers</CardTitle>
                <CardDescription>Top stocks by volume and price change</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Symbol</th>
                        <th className="text-left py-2 font-medium">Company</th>
                        <th className="text-right py-2 font-medium">Price</th>
                        <th className="text-right py-2 font-medium">Change</th>
                        <th className="text-right py-2 font-medium">Volume</th>
                        <th className="text-right py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stocks.map(stock => (
                        <tr key={stock.id} className="border-b hover:bg-gray-50">
                          <td className="py-2">{stock.symbol}</td>
                          <td className="py-2">{stock.name}</td>
                          <td className="py-2 text-right">${stock.price.toLocaleString()}</td>
                          <td className={`py-2 text-right ${stock.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
                          </td>
                          <td className="py-2 text-right">{stock.volume.toLocaleString()}</td>
                          <td className="py-2 text-right flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => handleAddToWatchlist(stock)}>
                              Watch
                            </Button>
                            <Button size="sm" onClick={() => handleBuyStock(stock)}>
                              Buy
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="watchlist">
            <Card>
              <CardHeader>
                <CardTitle>My Watchlist</CardTitle>
                <CardDescription>Stocks you're keeping an eye on</CardDescription>
              </CardHeader>
              <CardContent>
                {watchlist.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Your watchlist is empty</p>
                    <Button onClick={() => setActiveTab('market')}>Browse Market</Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">Symbol</th>
                          <th className="text-left py-2 font-medium">Company</th>
                          <th className="text-right py-2 font-medium">Price</th>
                          <th className="text-right py-2 font-medium">Change</th>
                          <th className="text-right py-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {watchlist.map(stock => (
                          <tr key={stock.id} className="border-b hover:bg-gray-50">
                            <td className="py-2">{stock.symbol}</td>
                            <td className="py-2">{stock.name}</td>
                            <td className="py-2 text-right">${stock.price.toLocaleString()}</td>
                            <td className={`py-2 text-right ${stock.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}
                            </td>
                            <td className="py-2 text-right flex gap-2 justify-end">
                              <Button size="sm" variant="outline" onClick={() => handleRemoveFromWatchlist(stock.id)}>
                                Remove
                              </Button>
                              <Button size="sm" onClick={() => handleBuyStock(stock)}>
                                Buy
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>My Portfolio</CardTitle>
                <CardDescription>Your investment performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Connect your trading account to see your portfolio</p>
                  <Button>Connect Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
}
