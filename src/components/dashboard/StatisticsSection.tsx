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

      {/* Team Financial Overview - Modern Animated Design */}
      <GlassCard className="border-0 shadow-xl bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white drop-shadow-sm">Team Financial Overview</CardTitle>
              <CardDescription className="text-blue-100">Real-time revenue performance and team metrics</CardDescription>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-bounce"></div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={teamData} 
                margin={{ top: 30, right: 40, left: 40, bottom: 20 }}
                className="drop-shadow-sm"
              >
                <defs>
                  <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.7}/>
                  </linearGradient>
                  <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.7}/>
                  </linearGradient>
                  <linearGradient id="defectGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.9}/>
                    <stop offset="100%" stopColor="#D97706" stopOpacity={0.7}/>
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid 
                  strokeDasharray="2 4" 
                  stroke="rgba(148, 163, 184, 0.3)" 
                  strokeWidth={1}
                />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }}
                  stroke="#64748B"
                  strokeWidth={2}
                  tickLine={{ stroke: '#64748B' }}
                />
                <YAxis 
                  yAxisId="left" 
                  tick={{ fill: '#475569', fontSize: 12 }}
                  stroke="#64748B"
                  strokeWidth={2}
                  tickLine={{ stroke: '#64748B' }}
                  label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#475569', fontWeight: 600 } }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  tick={{ fill: '#475569', fontSize: 12 }}
                  stroke="#64748B"
                  strokeWidth={2}
                  tickLine={{ stroke: '#64748B' }}
                  label={{ value: 'Defects', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#475569', fontWeight: 600 } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
                    backdropFilter: 'blur(12px)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  labelStyle={{ 
                    color: '#1F2937', 
                    fontWeight: 'bold',
                    fontSize: '16px',
                    marginBottom: '8px'
                  }}
                  formatter={(value, name) => [
                    `${typeof value === 'number' && name.includes('Revenue') ? '$' + value.toLocaleString() : value}`,
                    name
                  ]}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="rect"
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="gross" 
                  name="Gross Revenue ($)" 
                  fill="url(#grossGradient)" 
                  radius={[8, 8, 0, 0]}
                  filter="url(#glow)"
                  animationBegin={0}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="net" 
                  name="Net Revenue ($)" 
                  fill="url(#netGradient)" 
                  radius={[8, 8, 0, 0]}
                  filter="url(#glow)"
                  animationBegin={300}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="defects" 
                  name="Defect Tasks" 
                  fill="url(#defectGradient)" 
                  radius={[8, 8, 0, 0]}
                  filter="url(#glow)"
                  animationBegin={600}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Modern Stats Cards Below Chart */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
            {teamData.map((team, index) => (
              <div key={team.name} className="group">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">{team.name}</h4>
                    <div className={`w-3 h-3 rounded-full ${
                      team.name === 'Red Team' ? 'bg-blue-500' :
                      team.name === 'Blue Team' ? 'bg-green-500' : 'bg-orange-500'
                    } group-hover:scale-110 transition-transform duration-200`}></div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profit Margin:</span>
                      <span className="font-medium text-gray-800">{team.profitMargin}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Efficiency:</span>
                      <span className="font-medium text-gray-800">{team.efficiency}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Satisfaction:</span>
                      <span className="font-medium text-gray-800">{team.customerSatisfaction}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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