import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  LineChart,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, Target, ArrowUpRight, ArrowDownRight, Grid3X3, ChevronDown } from 'lucide-react';
import ModernButton from '@/components/ui/ModernButton';

// Clean, modern data structure
const monthlyRevenueData = [
  { month: 'Jan', revenue: 85000, expenses: 35000, profit: 50000, jobs: 45 },
  { month: 'Feb', revenue: 92000, expenses: 38000, profit: 54000, jobs: 52 },
  { month: 'Mar', revenue: 78000, expenses: 32000, profit: 46000, jobs: 38 },
  { month: 'Apr', revenue: 105000, expenses: 42000, profit: 63000, jobs: 67 },
  { month: 'May', revenue: 125000, expenses: 48000, profit: 77000, jobs: 75 },
  { month: 'Jun', revenue: 115000, expenses: 45000, profit: 70000, jobs: 68 },
  { month: 'Jul', revenue: 135000, expenses: 52000, profit: 83000, jobs: 82 },
  { month: 'Aug', revenue: 142000, expenses: 55000, profit: 87000, jobs: 89 },
  { month: 'Sep', revenue: 128000, expenses: 50000, profit: 78000, jobs: 76 },
  { month: 'Oct', revenue: 155000, expenses: 58000, profit: 97000, jobs: 95 },
  { month: 'Nov', revenue: 148000, expenses: 56000, profit: 92000, jobs: 88 },
  { month: 'Dec', revenue: 162000, expenses: 60000, profit: 102000, jobs: 98 }
];

const campaignData = [
  { name: 'Social Media', value: 35, color: '#3B82F6' },
  { name: 'Google Ads', value: 28, color: '#10B981' },
  { name: 'Referrals', value: 20, color: '#F59E0B' },
  { name: 'Direct', value: 17, color: '#EF4444' }
];

const quickStats = [
  {
    title: 'Monthly Revenue',
    value: '$162k',
    change: '+9.4%',
    trend: 'up',
    icon: DollarSign,
    color: 'emerald'
  },
  {
    title: 'Active Jobs',
    value: '98',
    change: '+11.2%',
    trend: 'up',
    icon: Users,
    color: 'blue'
  },
  {
    title: 'Profit Margin',
    value: '63%',
    change: '+2.1%',
    trend: 'up',
    icon: Target,
    color: 'purple'
  },
  {
    title: 'Customer Rate',
    value: '6.7%',
    change: '-0.3%',
    trend: 'down',
    icon: FileText,
    color: 'orange'
  }
];

interface ModernFinancialDashboardProps {
  className?: string;
}

export default function ModernFinancialDashboard({ className = "" }: ModernFinancialDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('12m');

  const formatValue = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium">{formatValue(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`w-full bg-gradient-to-br from-gray-50 to-blue-50 p-6 ${className}`} 
         style={{
           backgroundImage: `linear-gradient(rgba(156, 163, 175, 0.15) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(156, 163, 175, 0.15) 1px, transparent 1px)`,
           backgroundSize: '40px 40px'
         }}>
      <div className="w-full space-y-6">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="inline-flex">
                {"Financial Dashboard".split('').map((letter, index) => (
                  <span 
                    key={index}
                    className="inline-block animate-slideIn"
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      animationFillMode: 'both'
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </span>
              <span 
                className="inline-block text-green-500 animate-bounce-dollar"
                style={{
                  animationDelay: '1s',
                  animationFillMode: 'both'
                }}
              >
                $
              </span>
            </h1>
            <p className="text-gray-600 mt-1 text-sm">Real-time overview of your business performance</p>
          </div>
          <div className="flex items-center gap-2">
            <ModernButton
              variant="minimal"
              size="sm"
              className="h-10 w-12 px-1 border-gray-200 bg-white rounded-md"
            >
              <div className="flex items-center gap-1">
                <Grid3X3 className="w-4 h-4 text-blue-500" />
                <ChevronDown className="w-3 h-3 text-blue-500" />
              </div>
            </ModernButton>
            <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <TabsList className="bg-white border shadow-sm">
                <TabsTrigger value="7d" className="text-sm">7 Days</TabsTrigger>
                <TabsTrigger value="30d" className="text-sm">30 Days</TabsTrigger>
                <TabsTrigger value="12m" className="text-sm">12 Months</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>


        {/* Main Chart and Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Trend Chart */}
          <Card className="lg:col-span-2 border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">Revenue & Profit Trends</CardTitle>
              <p className="text-sm text-gray-600">Monthly performance over the past year</p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {/* Quick Stats Cards inside chart */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {quickStats.map((stat, index) => {
                  const Icon = stat.icon;
                  const isPositive = stat.trend === 'up';
                  const colorClasses = {
                    emerald: 'bg-emerald-500 text-white',
                    blue: 'bg-blue-500 text-white',
                    purple: 'bg-purple-500 text-white',
                    orange: 'bg-orange-500 text-white'
                  };

                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]} flex-shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-600 truncate">{stat.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">{stat.value}</span>
                          <div className={`flex items-center gap-1 text-xs px-1 py-0.5 rounded ${
                            isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {isPositive ? <ArrowUpRight className="w-2 h-2" /> : <ArrowDownRight className="w-2 h-2" />}
                            {stat.change}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      axisLine={{ stroke: '#E5E7EB' }}
                      tickLine={{ stroke: '#E5E7EB' }}
                      tickFormatter={(value) => formatValue(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fill="url(#revenueGradient)"
                      name="Revenue"
                      animationDuration={1500}
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#10B981"
                      strokeWidth={3}
                      fill="url(#profitGradient)"
                      name="Profit"
                      animationDuration={1500}
                      animationBegin={300}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Lead Sources Pie Chart */}
          <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">Lead Sources</CardTitle>
              <p className="text-sm text-gray-600">Where your customers come from</p>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-[400px] flex flex-col">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={campaignData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1500}
                      >
                        {campaignData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Percentage']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {campaignData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  );
}