import React from 'react';
import { KeyStatistics } from "@/components/statistics/KeyStatistics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { GlassCard } from "@/components/ui/GlassCard";
import { BarChart as BarChartIcon } from "lucide-react";

const teamData = [{
  name: 'Red Team',
  gross: 145000,
  net: 98000,
  defects: 12,
  profitMargin: 67.6,
  color: '#ef4444'
}, {
  name: 'Blue Team',
  gross: 165000,
  net: 120000,
  defects: 8,
  profitMargin: 72.7,
  color: '#3b82f6'
}, {
  name: 'Green Team',
  gross: 158000,
  net: 110000,
  defects: 5,
  profitMargin: 69.6,
  color: '#22c55e'
}];

export function StatisticsSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChartIcon className="h-8 w-8 text-gray-700" />
        <h2 className="text-2xl font-bold">Business Statistics</h2>
      </div>

      <Card>
        <CardHeader className="bg-slate-200">
          <CardTitle>Team Performance Overview</CardTitle>
          <CardDescription>Financial metrics and quality indicators by team</CardDescription>
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
                <YAxis yAxisId="profit" orientation="right" tickFormatter={value => `${value}%`} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="gross" name="Gross Revenue ($)" fill="#8884d8" />
                <Bar yAxisId="left" dataKey="net" name="Net Revenue ($)" fill="#82ca9d" />
                <Bar yAxisId="right" dataKey="defects" name="Defect Tasks" fill="#ffc658" />
                <Line yAxisId="profit" type="monotone" dataKey="profitMargin" name="Profit Margin (%)" stroke="#ff7300" strokeWidth={2} />
              </ComposedChart>
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