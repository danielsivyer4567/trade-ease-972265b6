
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

// Sample data - will be replaced with real API data later
const tradeActivityData = [
  { name: 'Jan', completed: 12, scheduled: 15, pending: 5 },
  { name: 'Feb', completed: 15, scheduled: 18, pending: 6 },
  { name: 'Mar', completed: 18, scheduled: 20, pending: 4 },
  { name: 'Apr', completed: 14, scheduled: 16, pending: 8 },
  { name: 'May', completed: 21, scheduled: 24, pending: 3 },
  { name: 'Jun', completed: 25, scheduled: 27, pending: 2 },
  { name: 'Jul', completed: 20, scheduled: 22, pending: 5 },
  { name: 'Aug', completed: 23, scheduled: 25, pending: 4 },
];

const tradeSummary = [
  { name: 'Completed Jobs', value: '125', change: '+8.6%', color: 'text-green-500' },
  { name: 'Active Jobs', value: '48', change: '+9.5%', color: 'text-green-500' },
  { name: 'Quotes Sent', value: '68', change: '+6.3%', color: 'text-green-500' },
  { name: 'Pending Reviews', value: '12', change: '-2.3%', color: 'text-red-500' },
  { name: 'Client Inquiries', value: '37', change: '+8.2%', color: 'text-green-500' },
  { name: 'Revenue', value: '$48,250', change: '+2.1%', color: 'text-green-500' },
];

const MarketOverview = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Trade Performance Summary</CardTitle>
          <CardDescription>Overview of job metrics for this quarter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tradeSummary.map((item) => (
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
          <CardTitle>Trade Activity Trends</CardTitle>
          <CardDescription>Monthly job completion performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={tradeActivityData}
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
                <Line type="monotone" dataKey="completed" stroke="#4ade80" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="scheduled" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="pending" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketOverview;
