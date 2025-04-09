
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MarketOverview() {
  // Mock data for the chart
  const dailyData = [
    { time: '9:30', value: 14000 },
    { time: '10:30', value: 14120 },
    { time: '11:30', value: 14350 },
    { time: '12:30', value: 14280 },
    { time: '13:30', value: 14400 },
    { time: '14:30', value: 14380 },
    { time: '15:30', value: 14500 },
    { time: '16:00', value: 14620 },
  ];
  
  const weeklyData = [
    { time: 'Mon', value: 14000 },
    { time: 'Tue', value: 14200 },
    { time: 'Wed', value: 14150 },
    { time: 'Thu', value: 14380 },
    { time: 'Fri', value: 14620 },
  ];
  
  const monthlyData = [
    { time: 'Jan', value: 13200 },
    { time: 'Feb', value: 13800 },
    { time: 'Mar', value: 14100 },
    { time: 'Apr', value: 14000 },
    { time: 'May', value: 14300 },
    { time: 'Jun', value: 14620 },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            <div className="text-xl font-bold text-green-500">
              S&P 500: 4,623.22 (+0.83%)
            </div>
          </div>
          
          <TabsContent value="daily" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin - 200', 'dataMax + 200']} />
                <Tooltip formatter={(value) => [`$${value}`, 'Index Value']} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="weekly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin - 200', 'dataMax + 200']} />
                <Tooltip formatter={(value) => [`$${value}`, 'Index Value']} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="monthly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin - 200', 'dataMax + 200']} />
                <Tooltip formatter={(value) => [`$${value}`, 'Index Value']} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
