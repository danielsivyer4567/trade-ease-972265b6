
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

// Sample data - will be replaced with real API data later
const marketData = [
  { name: '9:00 AM', S&P500: 4120, NASDAQ: 13550, DOW: 32800 },
  { name: '10:00 AM', S&P500: 4135, NASDAQ: 13580, DOW: 32850 },
  { name: '11:00 AM', S&P500: 4142, NASDAQ: 13620, DOW: 32900 },
  { name: '12:00 PM', S&P500: 4138, NASDAQ: 13600, DOW: 32880 },
  { name: '1:00 PM', S&P500: 4145, NASDAQ: 13640, DOW: 32920 },
  { name: '2:00 PM', S&P500: 4160, NASDAQ: 13680, DOW: 32970 },
  { name: '3:00 PM', S&P500: 4155, NASDAQ: 13660, DOW: 32950 },
  { name: '4:00 PM', S&P500: 4170, NASDAQ: 13700, DOW: 33000 },
];

const marketSummary = [
  { name: 'S&P 500', value: '4,170.50', change: '+0.86%', color: 'text-green-500' },
  { name: 'NASDAQ', value: '13,700.30', change: '+0.95%', color: 'text-green-500' },
  { name: 'DOW', value: '33,000.20', change: '+0.63%', color: 'text-green-500' },
  { name: 'BTC/USD', value: '63,245.18', change: '-1.23%', color: 'text-red-500' },
  { name: 'ETH/USD', value: '3,428.75', change: '-0.82%', color: 'text-red-500' },
  { name: 'EUR/USD', value: '1.0862', change: '+0.21%', color: 'text-green-500' },
];

const MarketOverview = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Market Summary</CardTitle>
          <CardDescription>Today's market overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {marketSummary.map((item) => (
              <div key={item.name} className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
                <span className="text-xl font-bold">{item.value}</span>
                <span className={`text-sm font-medium ${item.color}`}>{item.change}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Market Trends</CardTitle>
          <CardDescription>Major indices performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={marketData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} width={isMobile ? 30 : 40} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", border: "none" }} 
                  itemStyle={{ color: "#fff" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="S&P500" stroke="#4ade80" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="NASDAQ" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="DOW" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketOverview;
