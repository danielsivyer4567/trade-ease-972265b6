import React from 'react';
import { KeyStatistics } from "@/components/statistics/KeyStatistics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart, LineChart } from 'recharts';
import { GlassCard } from "@/components/ui/GlassCard";
import { BarChart as BarChartIcon } from "lucide-react";

const teamData = [{
  name: 'Red Team',
  gross: 145000,
  net: 98000,
  defects: 12,
  profitMargin: 67.6,
  efficiency: 85.2,
  customerSatisfaction: 92.1,
  color: '#ef4444'
}, {
  name: 'Blue Team',
  gross: 165000,
  net: 120000,
  defects: 8,
  profitMargin: 72.7,
  efficiency: 91.8,
  customerSatisfaction: 94.5,
  color: '#3b82f6'
}, {
  name: 'Green Team',
  gross: 158000,
  net: 110000,
  defects: 5,
  profitMargin: 69.6,
  efficiency: 88.7,
  customerSatisfaction: 96.2,
  color: '#22c55e'
}];

// Create performance line data for each team across metrics
const performanceLineData = [
  { 
    metric: 'Profit Margin', 
    RedTeam: 67.6, 
    BlueTeam: 72.7, 
    GreenTeam: 69.6 
  },
  { 
    metric: 'Efficiency', 
    RedTeam: 85.2, 
    BlueTeam: 91.8, 
    GreenTeam: 88.7 
  },
  { 
    metric: 'Customer Satisfaction', 
    RedTeam: 92.1, 
    BlueTeam: 94.5, 
    GreenTeam: 96.2 
  }
];

export function StatisticsSection() {
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChartIcon className="h-8 w-8 text-gray-700" />
        <h2 className="text-2xl font-bold">Business Statistics</h2>
      </div>

      <Card>
        <CardHeader className="bg-slate-200">
          <CardTitle>Team Financial Overview</CardTitle>
          <CardDescription>Revenue and defect metrics by team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={teamData} margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5
              }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="gross" name="Gross Revenue ($)" fill="#8884d8" />
                <Bar yAxisId="left" dataKey="net" name="Net Revenue ($)" fill="#82ca9d" />
                <Bar yAxisId="right" dataKey="defects" name="Defect Tasks" fill="#ffc658" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-500">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-blue-800">Team Performance Lines</CardTitle>
          <CardDescription>Each team's performance trajectory across metrics</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[300px] w-full bg-white">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={performanceLineData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="metric" 
                  angle={0}
                  textAnchor="middle"
                  height={40}
                  fontSize={11}
                />
                <YAxis 
                  domain={[60, 100]} 
                  tickFormatter={value => `${value}%`}
                  fontSize={11}
                />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="RedTeam" 
                  name="Red Team"
                  stroke="#ef4444" 
                  strokeWidth={5} 
                  strokeDasharray="8 4"
                  dot={{ fill: '#ef4444', strokeWidth: 3, r: 7 }}
                  connectNulls={true}
                />
                <Line 
                  type="monotone" 
                  dataKey="BlueTeam" 
                  name="Blue Team"
                  stroke="#3b82f6" 
                  strokeWidth={5} 
                  strokeDasharray="12 3"
                  dot={{ fill: '#3b82f6', strokeWidth: 3, r: 7 }}
                  connectNulls={true}
                />
                <Line 
                  type="monotone" 
                  dataKey="GreenTeam" 
                  name="Green Team"
                  stroke="#22c55e" 
                  strokeWidth={5}
                  dot={{ fill: '#22c55e', strokeWidth: 3, r: 7 }}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <GlassCard className="animate-slideUp">
        <KeyStatistics />
      </GlassCard>
    </div>
  );
} 