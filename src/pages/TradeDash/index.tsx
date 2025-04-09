
import React, { useState, useEffect } from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Activity, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function TradeDashboardPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mock data for portfolio performance
  const performanceData = [
    { name: 'Jan', value: 10000 },
    { name: 'Feb', value: 10250 },
    { name: 'Mar', value: 10100 },
    { name: 'Apr', value: 10600 },
    { name: 'May', value: 10850 },
    { name: 'Jun', value: 11200 },
    { name: 'Jul', value: 11500 },
    { name: 'Aug', value: 11250 },
    { name: 'Sep', value: 11700 },
    { name: 'Oct', value: 12100 },
    { name: 'Nov', value: 12300 },
    { name: 'Dec', value: 12700 },
  ];
  
  // Mock data for portfolio allocation
  const allocationData = [
    { name: 'Tech', value: 40 },
    { name: 'Finance', value: 25 },
    { name: 'Healthcare', value: 15 },
    { name: 'Energy', value: 10 },
    { name: 'Consumer', value: 5 },
    { name: 'Other', value: 5 },
  ];
  
  // Mock data for recent transactions
  const recentTransactions = [
    { id: 1, type: 'buy', symbol: 'AAPL', shares: 10, price: 173.88, total: 1738.80, date: '2024-04-08 14:32:15' },
    { id: 2, type: 'sell', symbol: 'MSFT', shares: 5, price: 403.78, total: 2018.90, date: '2024-04-07 10:15:22' },
    { id: 3, type: 'buy', symbol: 'GOOGL', shares: 8, price: 143.96, total: 1151.68, date: '2024-04-05 11:45:33' },
    { id: 4, type: 'buy', symbol: 'NVDA', shares: 3, price: 881.77, total: 2645.31, date: '2024-04-03 09:22:47' },
    { id: 5, type: 'sell', symbol: 'AMZN', shares: 6, price: 182.41, total: 1094.46, date: '2024-04-01 15:01:59' },
  ];
  
  // Mock portfolio value
  const portfolioValue = 27850.42;
  const totalReturn = 3245.78;
  const todayChange = 215.32;
  const todayChangePercent = 0.78;
  
  return (
    <BaseLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Trading Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/trading')}>
              Market
            </Button>
            <Button>
              Deposit Funds
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Portfolio Value</CardDescription>
                  <CardTitle className="text-2xl flex items-center">
                    <DollarSign className="w-5 h-5 mr-1" />
                    {portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Total Return: <span className="text-green-600">+${totalReturn.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Today's Change</CardDescription>
                  <CardTitle className="text-2xl flex items-center text-green-600">
                    <ArrowUpRight className="w-5 h-5 mr-1" />
                    ${todayChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {todayChangePercent > 0 ? '+' : ''}{todayChangePercent}% Today
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Positions</CardDescription>
                  <CardTitle className="text-2xl">12</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Across 8 different companies
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Available Cash</CardDescription>
                  <CardTitle className="text-2xl flex items-center">
                    <DollarSign className="w-5 h-5 mr-1" />
                    3,542.18
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Last deposit: 3 days ago
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>Total value over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => ['$' + value.toLocaleString(), 'Value']} />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#6366f1" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Allocation</CardTitle>
                  <CardDescription>By sector</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your most recent trades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Type</th>
                        <th className="text-left py-2 font-medium">Symbol</th>
                        <th className="text-right py-2 font-medium">Shares</th>
                        <th className="text-right py-2 font-medium">Price</th>
                        <th className="text-right py-2 font-medium">Total</th>
                        <th className="text-right py-2 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map(transaction => (
                        <tr key={transaction.id} className="border-b hover:bg-gray-50">
                          <td className={`py-2 ${transaction.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type.toUpperCase()}
                          </td>
                          <td className="py-2">{transaction.symbol}</td>
                          <td className="py-2 text-right">{transaction.shares}</td>
                          <td className="py-2 text-right">${transaction.price}</td>
                          <td className="py-2 text-right">${transaction.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-2 text-right">{transaction.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-center mt-6">
              <Button className="flex items-center gap-2" onClick={() => navigate('/trading')}>
                <TrendingUp className="w-4 h-4" />
                Go to Trading Platform
              </Button>
            </div>
          </>
        )}
      </div>
    </BaseLayout>
  );
}
