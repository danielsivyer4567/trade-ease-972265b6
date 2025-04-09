
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadCreditsCard } from "@/pages/TradeDash/components/LeadCreditsCard";
import { ArrowDown, ArrowUp, Percent, DollarSign } from 'lucide-react';

export const DashboardStats = () => {
  // Mock data - in a real app this would come from an API
  const stats = [
    { 
      title: "Total Revenue", 
      value: "$45,231.89", 
      change: "+20.1%",
      isPositive: true,
      icon: DollarSign
    },
    { 
      title: "New Leads", 
      value: "12",
      change: "+6.1%",
      isPositive: true,
      icon: Percent
    },
    { 
      title: "Active Jobs", 
      value: "24",
      change: "+14.2%", 
      isPositive: true,
      icon: ArrowUp
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.isPositive ? 'text-green-500' : 'text-red-500'} flex items-center mt-1`}>
              {stat.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
      <LeadCreditsCard creditsBalance={250} usedLeadsThisWeek={3} />
    </div>
  );
};
