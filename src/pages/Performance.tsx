
import React from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Gauge, TrendingUp, Award, Clock, Target, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/ui/GlassCard";

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
  const trendColor = trend === 'up' ? 'text-green-500' : 'text-red-500';
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {React.createElement(icon, { className: "h-5 w-5 text-gray-500" })}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <div className="flex items-center pt-1">
            {trend && <TrendIcon className={cn("h-4 w-4 mr-1", trendColor)} />}
            <p className={cn("text-xs", trend && trendColor)}>
              {percentage} <span className="text-gray-500">{description}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PerformanceMetric = ({ title, value, target, color }) => {
  const percentage = Math.round((value / target) * 100);
  const isOnTarget = percentage >= 100;
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{title}</span>
        <span className={cn(
          "text-xs font-medium",
          isOnTarget ? "text-green-500" : "text-amber-500"
        )}>
          {value}/{target} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={cn("h-2.5 rounded-full", color)} 
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

const Performance = () => {
  return (
    <BaseLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Performance Dashboard</h1>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <GlassCard>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Efficiency Trends</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} domain={[50, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                    name="Your Efficiency"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    strokeDasharray="5 5" 
                    name="Target"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="industry" 
                    stroke="#ffc658" 
                    strokeWidth={2} 
                    name="Industry Average"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>

        {/* Two-column layout for team performance and metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Team Performance */}
          <GlassCard>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Team Performance</h2>
              <div className="space-y-4">
                {teamPerformance.map((team) => (
                  <div key={team.name} className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">{team.name}</p>
                        <p className="text-sm text-gray-500">Performance Score</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xl font-bold mr-2">{team.score}</span>
                      <span className={cn(
                        "flex items-center text-xs",
                        team.trend === "up" ? "text-green-500" : "text-red-500"
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
            </div>
          </GlassCard>

          {/* Performance Metrics */}
          <GlassCard>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
              <div className="space-y-6">
                <PerformanceMetric 
                  title="On-Time Completion" 
                  value={92} 
                  target={90} 
                  color="bg-blue-600"
                />
                <PerformanceMetric 
                  title="Budget Adherence" 
                  value={88} 
                  target={95} 
                  color="bg-amber-500"
                />
                <PerformanceMetric 
                  title="Safety Compliance" 
                  value={100} 
                  target={100} 
                  color="bg-green-500"
                />
                <PerformanceMetric 
                  title="Quality Standards" 
                  value={96} 
                  target={90} 
                  color="bg-indigo-500"
                />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Performance;
