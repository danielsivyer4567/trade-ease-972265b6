
import React from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, CircleDollarSign, CheckCircle, Activity, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from "@/lib/utils";

// Sample data for charts
const tradingData = [{
  name: 'Jan',
  earnings: 4000,
  expenses: 2400,
  profit: 1600
}, {
  name: 'Feb',
  earnings: 3000,
  expenses: 1398,
  profit: 1602
}, {
  name: 'Mar',
  earnings: 2000,
  expenses: 1800,
  profit: 200
}, {
  name: 'Apr',
  earnings: 2780,
  expenses: 1908,
  profit: 872
}, {
  name: 'May',
  earnings: 1890,
  expenses: 1800,
  profit: 90
}, {
  name: 'Jun',
  earnings: 2390,
  expenses: 1800,
  profit: 590
}, {
  name: 'Jul',
  earnings: 3490,
  expenses: 2300,
  profit: 1190
}];

const marketData = [
  { name: 'Mon', value: 3400 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 3700 },
  { name: 'Thu', value: 3200 },
  { name: 'Fri', value: 3900 },
  { name: 'Sat', value: 3600 },
  { name: 'Sun', value: 3800 },
];

const recentTrades = [
  { id: 1, asset: 'BTC/USD', price: '42,850.23', change: '+2.45%', status: 'up' },
  { id: 2, asset: 'ETH/USD', price: '3,265.78', change: '-1.23%', status: 'down' },
  { id: 3, asset: 'XRP/USD', price: '0.5372', change: '+0.89%', status: 'up' },
  { id: 4, asset: 'SOL/USD', price: '124.35', change: '+4.18%', status: 'up' },
  { id: 5, asset: 'ADA/USD', price: '0.4856', change: '-0.72%', status: 'down' },
];

// Stat Card Component
const StatCard = ({ title, value, icon, trend, percentage, className }) => {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? ArrowUp : ArrowDown;

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {React.createElement(icon, { className: "h-5 w-5 text-gray-500" })}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1">
          <TrendIcon className={cn("h-4 w-4 mr-1", 
            isPositive ? "text-green-500" : "text-red-500"
          )} />
          <p className={cn("text-xs",
            isPositive ? "text-green-500" : "text-red-500"
          )}>
            {percentage}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const TradeDash = () => {
  return (
    <BaseLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Trading Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Daily Volume" 
            value="$2.4M" 
            icon={CircleDollarSign} 
            trend="up" 
            percentage="12% from yesterday"
          />
          <StatCard 
            title="Active Traders" 
            value="1,893" 
            icon={Users} 
            trend="up" 
            percentage="8% from last week"
          />
          <StatCard 
            title="Successful Trades" 
            value="92%" 
            icon={CheckCircle} 
            trend="up" 
            percentage="3% from last month"
          />
          <StatCard 
            title="Market Volatility" 
            value="Medium" 
            icon={Activity} 
            trend="down" 
            percentage="5% decrease"
          />
        </div>

        {/* Main Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Trading Performance</CardTitle>
            <CardDescription>Your earnings, expenses and profit over time</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={tradingData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="earnings" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="expenses" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="profit" stroke="#ff7300" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Two-column layout for additional charts and recent trades */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Market Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Market Activity</CardTitle>
              <CardDescription>Daily market movements</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Trades */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
              <CardDescription>Latest market activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{trade.asset}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-semibold">{trade.price}</p>
                      <span className={cn("flex items-center text-xs",
                        trade.status === "up" ? "text-green-500" : "text-red-500"
                      )}>
                        {trade.status === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        {trade.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default TradeDash;
