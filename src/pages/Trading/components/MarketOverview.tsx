
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MarketOverview() {
  // Mock data for the chart
  const dailyData = [
    { time: '9:30', value: 14 },
    { time: '10:30', value: 18 },
    { time: '11:30', value: 16 },
    { time: '12:30', value: 19 },
    { time: '13:30', value: 22 },
    { time: '14:30', value: 25 },
    { time: '15:30', value: 28 },
    { time: '16:00', value: 30 },
  ];
  
  const weeklyData = [
    { time: 'Mon', value: 15 },
    { time: 'Tue', value: 18 },
    { time: 'Wed', value: 22 },
    { time: 'Thu', value: 26 },
    { time: 'Fri', value: 30 },
  ];
  
  const monthlyData = [
    { time: 'Jan', value: 150 },
    { time: 'Feb', value: 165 },
    { time: 'Mar', value: 180 },
    { time: 'Apr', value: 195 },
    { time: 'May', value: 210 },
    { time: 'Jun', value: 230 },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Job Performance Overview</CardTitle>
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
              Jobs Completed: 125 (+8%)
            </div>
          </div>
          
          <TabsContent value="daily" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip formatter={(value) => [`${value} jobs`, 'Completed']} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="weekly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip formatter={(value) => [`${value} jobs`, 'Completed']} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="monthly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip formatter={(value) => [`${value} jobs`, 'Completed']} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
