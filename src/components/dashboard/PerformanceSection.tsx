import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Gauge, TrendingUp, Award, Clock, Target, ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";

// Unified color palette matching StatisticsSection
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

// Sample data for charts
const performanceData = [
  { month: 'Jan', efficiency: 85, target: 80, industry: 78 },
  { month: 'Feb', efficiency: 78, target: 80, industry: 76 },
  { month: 'Mar', efficiency: 82, target: 80, industry: 77 },
  { month: 'Apr', efficiency: 86, target: 80, industry: 78 },
  { month: 'May', efficiency: 84, target: 80, industry: 79 },
  { month: 'Jun', efficiency: 90, target: 85, industry: 80 },
  { month: 'Jul', efficiency: 93, target: 85, industry: 80 },
];

const teamPerformance = [
  { name: 'Team A', score: 92, change: '+4%', trend: 'up' },
  { name: 'Team B', score: 88, change: '+2%', trend: 'up' },
  { name: 'Team C', score: 76, change: '-3%', trend: 'down' },
  { name: 'Team D', score: 84, change: '+1%', trend: 'up' },
];

const KpiCard = ({ title, value, icon, description, trend, percentage }) => {
  const TrendIcon = trend === 'up' ? ArrowUp : ArrowDown;
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  
  return (
    <GlassCard className="h-full border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className="p-2 bg-blue-50 rounded-lg">
          {React.createElement(icon, { className: "h-4 w-4 text-blue-600" })}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>
        {description && (
          <div className="flex items-center">
            {trend && <TrendIcon className={cn("h-4 w-4 mr-1", trendColor)} />}
            <p className="text-xs text-gray-600">
              <span className={cn("font-medium", trend && trendColor)}>{percentage}</span>
              <span className="ml-1">{description}</span>
            </p>
          </div>
        )}
      </CardContent>
    </GlassCard>
  );
};

const PerformanceMetric = ({ title, value, target, color }) => {
  const percentage = Math.round((value / target) * 100);
  const isOnTarget = percentage >= 100;
  
  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-gray-100">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <span className={cn(
          "text-xs font-semibold px-2 py-1 rounded-full",
          isOnTarget ? "text-green-700 bg-green-100" : "text-amber-700 bg-amber-100"
        )}>
          {value}/{target} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={cn("h-2 rounded-full transition-all duration-500", color)} 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export function PerformanceSection() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
        <div className="p-2 bg-green-50 rounded-lg">
          <Activity className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Performance Dashboard</h2>
          <p className="text-gray-600 mt-1">Monitor key metrics and team performance indicators</p>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Efficiency Rating" 
          value="92%" 
          icon={Gauge} 
          description="vs industry avg" 
          trend="up"
          percentage="12%"
        />
        <KpiCard 
          title="Project Completion Rate" 
          value="97%" 
          icon={Target} 
          description="last quarter" 
          trend="up"
          percentage="5%"
        />
        <KpiCard 
          title="Average Job Time" 
          value="4.2 days" 
          icon={Clock} 
          description="per job" 
          trend="down"
          percentage="8%"
        />
        <KpiCard 
          title="Quality Score" 
          value="4.8/5" 
          icon={Award} 
          description="customer ratings" 
          trend="up"
          percentage="0.3"
        />
      </div>

      {/* Main Performance Chart */}
      <GlassCard className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Efficiency Trends</CardTitle>
              <p className="text-gray-600 mt-1">Track performance over time compared to targets and industry standards</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis 
                  dataKey="month" 
                  fontSize={12} 
                  tick={{ fill: colors.neutral }}
                  stroke={colors.neutral}
                />
                <YAxis 
                  fontSize={12} 
                  domain={[50, 100]} 
                  tick={{ fill: colors.neutral }}
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
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke={colors.primary}
                  strokeWidth={3} 
                  dot={{ fill: colors.primary, strokeWidth: 2, r: 6 }} 
                  name="Your Efficiency"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke={colors.accent}
                  strokeWidth={2}
                  strokeDasharray="5 5" 
                  dot={{ fill: colors.accent, strokeWidth: 2, r: 4 }}
                  name="Target"
                />
                <Line 
                  type="monotone" 
                  dataKey="industry" 
                  stroke={colors.warning}
                  strokeWidth={2} 
                  dot={{ fill: colors.warning, strokeWidth: 2, r: 4 }}
                  name="Industry Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team Performance */}
        <GlassCard className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Team Performance</CardTitle>
                <p className="text-gray-600 mt-1">Individual team performance scores and trends</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {teamPerformance.map((team, index) => (
                <div key={team.name} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center">
                    <div className={cn(
                      "p-2 rounded-full mr-3",
                      index === 0 ? "bg-blue-100" : index === 1 ? "bg-green-100" : index === 2 ? "bg-amber-100" : "bg-purple-100"
                    )}>
                      <TrendingUp className={cn(
                        "h-5 w-5",
                        index === 0 ? "text-blue-600" : index === 1 ? "text-green-600" : index === 2 ? "text-amber-600" : "text-purple-600"
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{team.name}</p>
                      <p className="text-sm text-gray-600">Performance Score</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">{team.score}</span>
                    <span className={cn(
                      "flex items-center text-sm font-medium px-2 py-1 rounded-full",
                      team.trend === "up" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                    )}>
                      {team.trend === "up" ? 
                        <ArrowUp className="h-4 w-4 mr-1" /> : 
                        <ArrowDown className="h-4 w-4 mr-1" />
                      }
                      {team.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </GlassCard>

        {/* Performance Metrics */}
        <GlassCard className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Performance Metrics</CardTitle>
                <p className="text-gray-600 mt-1">Key performance indicators and progress tracking</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <PerformanceMetric 
                title="On-Time Completion" 
                value={92} 
                target={90} 
                color="bg-gradient-to-r from-blue-500 to-blue-600"
              />
              <PerformanceMetric 
                title="Budget Adherence" 
                value={88} 
                target={95} 
                color="bg-gradient-to-r from-amber-500 to-amber-600"
              />
              <PerformanceMetric 
                title="Safety Compliance" 
                value={100} 
                target={100} 
                color="bg-gradient-to-r from-green-500 to-green-600"
              />
              <PerformanceMetric 
                title="Quality Standards" 
                value={96} 
                target={90} 
                color="bg-gradient-to-r from-purple-500 to-purple-600"
              />
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
} 