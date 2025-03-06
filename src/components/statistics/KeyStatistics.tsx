
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, TrendingUp, CircleDollarSign, UserCheck, Star, MapPin, Eye, MessageSquare } from "lucide-react";

interface Statistic {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  description: string;
}

const keyStatistics: Statistic[] = [
  {
    title: "Monthly Revenue",
    value: "$45,289",
    change: "+12.5%",
    trend: "up",
    icon: BarChart,
    description: "vs. last month"
  },
  {
    title: "Active Jobs",
    value: "24",
    change: "+4",
    trend: "up",
    icon: TrendingUp,
    description: "vs. last week"
  },
  {
    title: "Customer Satisfaction",
    value: "94%",
    change: "+2%",
    trend: "up",
    icon: UserCheck,
    description: "based on recent reviews"
  },
  {
    title: "Outstanding Payments",
    value: "$12,450",
    change: "-15%",
    trend: "down",
    icon: CircleDollarSign,
    description: "vs. last month"
  }
];

const googleBusinessStats: Statistic[] = [
  {
    title: "Google Rating",
    value: "4.8",
    change: "+0.3",
    trend: "up",
    icon: Star,
    description: "last 30 days"
  },
  {
    title: "Profile Views",
    value: "1,284",
    change: "+22%",
    trend: "up",
    icon: Eye,
    description: "vs. last month"
  },
  {
    title: "Customer Reviews",
    value: "156",
    change: "+12",
    trend: "up",
    icon: MessageSquare,
    description: "last 30 days"
  },
  {
    title: "Location Searches",
    value: "892",
    change: "+15%",
    trend: "up",
    icon: MapPin,
    description: "vs. last month"
  }
];

export function KeyStatistics() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Google My Business Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {googleBusinessStats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="space-y-0 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center mt-1">
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Key Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyStatistics.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="space-y-0 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center mt-1">
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
