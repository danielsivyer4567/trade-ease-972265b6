import React from 'react';
import { KeyStatistics } from "@/components/statistics/KeyStatistics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { GlassCard } from "@/components/ui/GlassCard";
import { BarChart3, TrendingUp } from "lucide-react";

// Unified color palette for consistent design
const colors = {
  primary: '#1e40af',    // Modern blue
  secondary: '#3b82f6',  // Lighter blue
  tertiary: '#60a5fa',   // Even lighter blue
  accent: '#10b981',     // Green for positive metrics
  warning: '#f59e0b',    // Amber for attention items
  neutral: '#6b7280',    // Gray for secondary info
  background: '#f8fafc', // Light gray background
  border: '#e2e8f0'      // Subtle border color
};

const teamData = [{
  name: 'Red Team',
  gross: 145000,
  net: 98000,
  defects: 12,
  profitMargin: 67.6,
  efficiency: 85.2,
  customerSatisfaction: 92.1,
}, {
  name: 'Blue Team',
  gross: 165000,
  net: 120000,
  defects: 8,
  profitMargin: 72.7,
  efficiency: 91.8,
  customerSatisfaction: 94.5,
}, {
  name: 'Green Team',
  gross: 158000,
  net: 110000,
  defects: 5,
  profitMargin: 69.6,
  efficiency: 88.7,
  customerSatisfaction: 96.2,
}];

// Performance line data with consistent structure
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
        <div className="p-2 bg-blue-50 rounded-lg">
          <BarChart3 className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Business Analytics</h2>
          <p className="text-gray-600 mt-1">Track performance metrics and team productivity</p>
        </div>
      </div>

      {/* Team Financial Overview */}
      <GlassCard className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Team Financial Overview</CardTitle>
              <CardDescription className="text-gray-600">Revenue performance and defect tracking by team</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: colors.neutral, fontSize: 12 }}
                  stroke={colors.neutral}
                />
                <YAxis 
                  yAxisId="left" 
                  tick={{ fill: colors.neutral, fontSize: 12 }}
                  stroke={colors.neutral}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tick={{ fill: colors.neutral, fontSize: 12 }}
                  stroke={colors.neutral}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="gross" name="Gross Revenue ($)" fill={colors.primary} radius={[4, 4, 0, 0]} />
                <Bar yAxisId="left" dataKey="net" name="Net Revenue ($)" fill={colors.accent} radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="defects" name="Defect Tasks" fill={colors.warning} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </GlassCard>

      {/* Team Performance Trends */}
      <GlassCard className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Team Performance Trends</CardTitle>
              <CardDescription className="text-gray-600">Performance metrics comparison across teams</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={performanceLineData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis 
                  dataKey="metric" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                  tick={{ fill: colors.neutral }}
                  stroke={colors.neutral}
                />
                <YAxis 
                  domain={[60, 100]} 
                  tickFormatter={value => `${value}%`}
                  fontSize={12}
                  tick={{ fill: colors.neutral }}
                  stroke={colors.neutral}
                />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, name]}
                  labelFormatter={(label) => `${label}`}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: `1px solid ${colors.border}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="RedTeam" 
                  name="Red Team"
                  stroke={colors.primary}
                  strokeWidth={3} 
                  dot={{ fill: colors.primary, strokeWidth: 2, r: 6 }}
                  connectNulls={true}
                />
                <Line 
                  type="monotone" 
                  dataKey="BlueTeam" 
                  name="Blue Team"
                  stroke={colors.accent}
                  strokeWidth={3} 
                  dot={{ fill: colors.accent, strokeWidth: 2, r: 6 }}
                  connectNulls={true}
                />
                <Line 
                  type="monotone" 
                  dataKey="GreenTeam" 
                  name="Green Team"
                  stroke={colors.warning}
                  strokeWidth={3}
                  dot={{ fill: colors.warning, strokeWidth: 2, r: 6 }}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </GlassCard>

      {/* Key Statistics */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Indicators</h3>
        <KeyStatistics />
      </div>
    </div>
  );
} 