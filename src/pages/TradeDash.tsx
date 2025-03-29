
import React, { useState } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, BarChart2, TrendingUp, DollarSign, Users, Clock, ArrowUpRight, PercentCircle, Wallet } from "lucide-react";
import { Link } from 'react-router-dom';

const TradeDash = () => {
  // State for switch between daily/weekly/monthly view
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  
  // Sample data for dashboard stats
  const stats = {
    revenue: {
      daily: "$1,250",
      weekly: "$8,740",
      monthly: "$32,450"
    },
    jobs: {
      daily: "3",
      weekly: "18",
      monthly: "76"
    },
    leads: {
      daily: "5",
      weekly: "24",
      monthly: "98"
    },
    conversion: {
      daily: "60%",
      weekly: "75%",
      monthly: "78%"
    }
  };

  // Sample data for recent trades
  const recentTrades = [
    { id: 1, customer: "John Smith", service: "Plumbing", amount: "$850", status: "Completed", date: "Today" },
    { id: 2, customer: "Sarah Johnson", service: "Electrical", amount: "$1,200", status: "In Progress", date: "Yesterday" },
    { id: 3, customer: "Michael Brown", service: "Carpentry", amount: "$2,300", status: "Scheduled", date: "Jan 15" },
    { id: 4, customer: "Emma Davis", service: "Roofing", amount: "$3,600", status: "Quote Sent", date: "Jan 14" },
    { id: 5, customer: "Robert Wilson", service: "Painting", amount: "$1,500", status: "Pending", date: "Jan 10" }
  ];

  return (
    <BaseLayout>
      <div className="p-6 space-y-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">Trade Dashboard</h1>
            <p className="text-muted-foreground">Overview of your trade business performance</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={timeframe === 'daily' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('daily')}
            >
              Daily
            </Button>
            <Button 
              variant={timeframe === 'weekly' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('weekly')}
            >
              Weekly
            </Button>
            <Button 
              variant={timeframe === 'monthly' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('monthly')}
            >
              Monthly
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.revenue[timeframe]}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 mr-1">+12.5%</span> from last {timeframe.slice(0, -2)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.jobs[timeframe]}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 mr-1">+8.2%</span> from last {timeframe.slice(0, -2)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.leads[timeframe]}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 mr-1">+18.3%</span> from last {timeframe.slice(0, -2)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <PercentCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversion[timeframe]}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500 mr-1">+2.5%</span> from last {timeframe.slice(0, -2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Showing revenue trends for the {timeframe} period
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground flex flex-col items-center">
                <BarChart2 className="h-16 w-16 mb-2 text-primary/50" />
                <p>Revenue chart visualization</p>
                <p className="text-sm">(Connect to real data source for live charts)</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Trades */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Trades</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTrades.slice(0, 4).map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{trade.customer}</p>
                      <p className="text-sm text-muted-foreground">{trade.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{trade.amount}</p>
                      <p className="text-xs text-muted-foreground">{trade.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/calendar">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-[120px]">
                <CalendarDays className="h-8 w-8 mb-2 text-primary" />
                <CardTitle className="text-base">Schedule Job</CardTitle>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/quotes/new">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-[120px]">
                <TrendingUp className="h-8 w-8 mb-2 text-primary" />
                <CardTitle className="text-base">Create Quote</CardTitle>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/payments/new">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-[120px]">
                <Wallet className="h-8 w-8 mb-2 text-primary" />
                <CardTitle className="text-base">Process Payment</CardTitle>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/customers">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center h-[120px]">
                <Users className="h-8 w-8 mb-2 text-primary" />
                <CardTitle className="text-base">Manage Customers</CardTitle>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </BaseLayout>
  );
};

export default TradeDash;
